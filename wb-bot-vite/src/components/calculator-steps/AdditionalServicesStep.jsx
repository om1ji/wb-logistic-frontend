import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  CircularProgress,
  TextField,
  Alert,
  Box,
  Divider
} from '@mui/material';
import { api } from '../../api/client.tsx';

const StyledPaper = styled(Paper)`
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled(Typography)`
  margin-bottom: 2rem;
  color: var(--tg-theme-text-color, #000);
`;

const ServiceTypeTitle = styled(Typography)`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--tg-theme-text-color, #000);
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  width: 100%;
  margin: 0;
  .MuiFormControlLabel-label {
    width: 100%;
  }
`;

const ServiceLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 16px;
`;

const ServiceName = styled.span`
  flex-shrink: 1;
  min-width: 0;
`;

const ServicePrice = styled(Typography)`
  color: #666;
  flex-shrink: 0;
`;

const AdditionalServicesStep = ({ formData, pickupAddress = '', updateFormData, onValidationChange, shouldValidate, showErrors }) => {
  const [serviceGroups, setServiceGroups] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(pickupAddress);

  // Загрузка списка услуг
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.getAdditionalServices();
        setServiceGroups(response.serviceGroups);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Функция валидации
  const validate = useCallback(() => {
    const newErrors = {};
    
    // Проверяем адреса для услуг, требующих локацию
    const hasPickupService = formData.some(serviceId => {
      const service = serviceGroups
        .flatMap(group => group.services)
        .find(s => s.id === serviceId);
      return service?.requires_location;
    });

    if (hasPickupService && !address.trim()) {
      newErrors.pickupAddress = 'Укажите адрес для забора груза';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return isValid;
  }, [formData, serviceGroups, address]);

  // Эффект для валидации
  useEffect(() => {
    if (shouldValidate) {
      const isValid = validate();
      if (onValidationChange) {
        onValidationChange(isValid);
      }
    }
  }, [shouldValidate, validate, onValidationChange]);

  const handleServiceChange = (serviceId) => (event) => {
    const isChecked = event.target.checked;
    const newSelectedServices = isChecked
      ? [...formData, serviceId]
      : formData.filter(id => id !== serviceId);

    // Если убрали все услуги с адресом, очищаем адрес
    const hasLocationService = newSelectedServices.some(id => {
      const service = serviceGroups
        .flatMap(group => group.services)
        .find(s => s.id === id);
      return service?.requires_location;
    });

    if (!hasLocationService) {
      setAddress('');
    }

    updateFormData({
      additionalServices: newSelectedServices,
      pickupAddress: hasLocationService ? address : ''
    }, true);
  };

  const handleAddressChange = (event) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
    updateFormData({
      additionalServices: formData,
      pickupAddress: newAddress
    });
  };

  if (loading) {
    return (
      <StyledPaper elevation={0}>
        <LoadingWrapper>
          <CircularProgress />
        </LoadingWrapper>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper elevation={0}>
      <SectionTitle variant="h4">
        Дополнительные услуги
      </SectionTitle>

      {serviceGroups.map((group, index) => (
        <Box key={group.title} mb={3}>
          <ServiceTypeTitle variant="h6">
            {group.title}
          </ServiceTypeTitle>
          
          <FormControl component="fieldset" fullWidth>
            <FormGroup>
              {group.services.map((service) => (
                <Box key={service.id} mb={service.requires_location ? 2 : 1}>
                  <StyledFormControlLabel
                    control={
                      <Checkbox
                        checked={formData.includes(service.id)}
                        onChange={handleServiceChange(service.id)}
                      />
                    }
                    label={
                      <ServiceLabel>
                        <ServiceName>{service.name}</ServiceName>
                        <ServicePrice variant="body2">
                          {service.price}
                        </ServicePrice>
                      </ServiceLabel>
                    }
                  />
                </Box>
              ))}
            </FormGroup>
          </FormControl>
          
          {index < serviceGroups.length - 1 && <Divider style={{ marginTop: '1rem' }} />}
        </Box>
      ))}

      {formData.some(serviceId => {
        const service = serviceGroups
          .flatMap(group => group.services)
          .find(s => s.id === serviceId);
        return service?.requires_location;
      }) && (
        <Box mt={3}>
          <TextField
            fullWidth
            label="Адрес забора груза"
            value={address}
            onChange={handleAddressChange}
            error={showErrors && !!errors.pickupAddress}
            helperText={showErrors && errors.pickupAddress}
          />
        </Box>
      )}
    </StyledPaper>
  );
};

export default AdditionalServicesStep; 