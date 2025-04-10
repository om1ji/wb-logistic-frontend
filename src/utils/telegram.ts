/**
 * Проверяет, запущено ли приложение в Telegram Mini App
 */
export const isTelegramApp = (): boolean => {
  return !!window.Telegram?.WebApp;
};

/**
 * Получает данные инициализации Telegram Mini App в виде URL-параметров
 * @returns Объект с параметрами или null, если приложение не запущено в Telegram
 */
export const getTelegramInitData = (): Record<string, string> | null => {
  if (!isTelegramApp()) {
    return null;
  }

  const webApp = window.Telegram?.WebApp;
  if (!webApp) return null;
  
  const initData = webApp.initData || '';
  
  if (!initData) {
    return null;
  }

  // Разбираем строку initData
  const params = new URLSearchParams(initData);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Получает пользовательские данные из Telegram
 */
export const getTelegramUser = () => {
  if (!isTelegramApp()) {
    return null;
  }
  
  const webApp = window.Telegram?.WebApp;
  if (!webApp) return null;
  
  return webApp.initDataUnsafe?.user || null;
};

/**
 * Объявляем глобальный тип для Telegram WebApp
 */
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          query_id?: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        themeParams?: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        MainButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
        };
      };
    };
  }
} 