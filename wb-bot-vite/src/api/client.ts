const API_BASE_URL = 'http://localhost:8000';

interface Warehouse {
    id: number;
    city: string;
    city_name: string;
    marketplace: string;    
    marketplace_name: string;
    name: string;
}

interface ContainerType {
    id: number;
    name: string;
    description: string;
    container_type: string;
    box_size: string;
    pallet_weight: string;
}

interface PriceResponse {
    total_price: string;
    currency: string;
    details: {
        delivery: string;
        cargo: string;
        additional_services: string;
    };
}

interface OrderResponse {
    success: boolean;
    message: string;
    order?: {
        id: string;
        sequence_number: number;
        status: string;
        total_price: string;
        created_at: string;
        warehouse_id: number | null;
        pickup_address: string;
        client: {
            name: string;
            phone: string;
            company?: string;
            email?: string;
        };
        cargo: {
            type: string;
            container_type: string;
            box_count: number;
            pallet_count: number;
            dimensions: {
                length: string;
                width: string;
                height: string;
                weight: string;
            };
        };
        additional_services: any[];
    };
    error?: string;
}

interface FormData {
    marketplace?: string;
    warehouse?: string | number;
    cargoType?: string;
    selectedTypes?: string[];
    quantities?: Record<string, string | number>;
    selectedBoxSizes?: string[];
    selectedPalletWeights?: string[];
    customBoxSize?: { length: string; width: string; height: string };
    customPalletWeight?: string;
    boxCount?: string | number;
    palletCount?: string | number;
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
    containerType?: string;
    clientName?: string;
    phoneNumber?: string;
    company?: string;
    email?: string;
    additionalServices?: any[];
    pickupAddress?: string;
    deliveryWarehouse?: string;
}

export const api = {
    // Получение списка маркетплейсов со складами
    async getWarehouses() : Promise<Warehouse[]> {
        const response = await fetch(`${API_BASE_URL}/orders/warehouses/`);
        if (!response.ok) {
            throw new Error('Failed to fetch marketplaces');
        }
        return response.json();
    },

    // Получение списка типов контейнеров
    async getContainerTypes() : Promise<ContainerType[]> {
        const response = await fetch(`${API_BASE_URL}/orders/containers/`);
        if (!response.ok) {
            throw new Error('Failed to fetch container types');
        }
        return response.json();
    },

    // Получение списка дополнительных услуг
    async getAdditionalServices() {
        const response = await fetch(`${API_BASE_URL}/orders/additional_services/`);
        if (!response.ok) {
            throw new Error('Failed to fetch additional services');
        }
        return response.json();
    },

    // Создание заказа
    async createOrder(formData: FormData): Promise<OrderResponse> {
        // Определяем тип груза
        let cargo_type = 'box';
        if (formData.selectedTypes?.includes('Паллета') && !formData.selectedTypes?.includes('Коробка')) {
            cargo_type = 'pallet';
        } else if (formData.selectedTypes?.includes('Паллета') && formData.selectedTypes?.includes('Коробка')) {
            cargo_type = 'both';
        }

        // Подготовим данные для отправки на сервер
        const apiData = {
            delivery: {
                warehouse_id: formData.warehouse,
                marketplace: formData.marketplace
            },
            cargo: {
                cargo_type,
                box_container_type: formData.selectedTypes?.includes('Коробка')
                    ? (formData.selectedBoxSizes?.[0] === 'Другой размер' ? 'Другой размер' : formData.selectedBoxSizes?.[0] || '')
                    : '',
                pallet_container_type: formData.selectedTypes?.includes('Паллета')
                    ? (formData.selectedPalletWeights?.[0] === 'Другой вес' ? 'Другой вес' : formData.selectedPalletWeights?.[0] || '')
                    : '',
                box_count: formData.selectedTypes?.includes('Коробка')
                    ? parseInt(String(formData.quantities?.['Коробка'] || formData.boxCount || '0'))
                    : 0,
                pallet_count: formData.selectedTypes?.includes('Паллета')
                    ? parseInt(String(formData.quantities?.['Паллета'] || formData.palletCount || '0'))
                    : 0,
                dimensions: {
                    length: formData.selectedBoxSizes?.[0] === 'Другой размер' ? formData.length || '' : '',
                    width: formData.selectedBoxSizes?.[0] === 'Другой размер' ? formData.width || '' : '',
                    height: formData.selectedBoxSizes?.[0] === 'Другой размер' ? formData.height || '' : '',
                    weight: formData.selectedPalletWeights?.[0] === 'Другой вес' ? formData.weight || '' : ''
                }
            },
            client: {
                name: formData.clientName || '',
                phone: formData.phoneNumber || '',
                company: formData.company || '',
                email: formData.email || ''
            },
            additional_services: formData.additionalServices || [],
            pickup_address: formData.pickupAddress || ''
        };

        const response = await fetch(`${API_BASE_URL}/api/order/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData),
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Server error response:', error);
            throw new Error(error.message || error.error || 'Failed to create order');
        }
        
        return response.json();
    },
    
    // Расчет стоимости заказа
    async calculatePrice(formData: FormData): Promise<PriceResponse> {
        // Определяем тип груза
        let cargo_type = 'box';
        if (formData.selectedTypes?.includes('Паллета') && !formData.selectedTypes?.includes('Коробка')) {
            cargo_type = 'pallet';
        } else if (formData.selectedTypes?.includes('Паллета') && formData.selectedTypes?.includes('Коробка')) {
            cargo_type = 'both';
        }

        // Подготовим данные для отправки на сервер
        const apiPriceData = {
            delivery: {
                warehouse_id: formData.warehouse,
                marketplace: formData.marketplace
            },
            cargo: {
                cargo_type,
                box_container_type: formData.selectedTypes?.includes('Коробка')
                    ? (formData.selectedBoxSizes?.[0] === 'Другой размер' ? 'Другой размер' : formData.selectedBoxSizes?.[0] || '')
                    : '',
                pallet_container_type: formData.selectedTypes?.includes('Паллета')
                    ? (formData.selectedPalletWeights?.[0] === 'Другой вес' ? 'Другой вес' : formData.selectedPalletWeights?.[0] || '')
                    : '',
                box_count: formData.selectedTypes?.includes('Коробка')
                    ? parseInt(String(formData.quantities?.['Коробка'] || formData.boxCount || '0'))
                    : 0,
                pallet_count: formData.selectedTypes?.includes('Паллета')
                    ? parseInt(String(formData.quantities?.['Паллета'] || formData.palletCount || '0'))
                    : 0,
                dimensions: {
                    length: formData.selectedBoxSizes?.[0] === 'Другой размер' ? formData.length || '' : '',
                    width: formData.selectedBoxSizes?.[0] === 'Другой размер' ? formData.width || '' : '',
                    height: formData.selectedBoxSizes?.[0] === 'Другой размер' ? formData.height || '' : '',
                    weight: formData.selectedPalletWeights?.[0] === 'Другой вес' ? formData.weight || '' : ''
                }
            },
            additional_services: formData.additionalServices || [],
            pickup_address: formData.pickupAddress || ''
        };

        const response = await fetch(`${API_BASE_URL}/orders/calculate-price/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiPriceData),
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error("Price calculation error:", error);
            throw new Error(error.error || 'Failed to calculate price');
        }
        
        const result = await response.json();
        return result;
    }
}; 