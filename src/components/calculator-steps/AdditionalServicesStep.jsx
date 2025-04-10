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
import { api } from '../../api/client';

const StyledPaper = styled(Paper)`
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
        console.log('Fetching additional services...');
        const response = await api.getAdditionalServices();
        console.log('Received response:', response);
        setServiceGroups(response.serviceGroups);
        console.log('Updated serviceGroups:', response.serviceGroups);
      } catch (error) {
        console.error('Failed to fetch additional services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Функция валидации
  const validate = useCallback(() => {
    const newErrors = {};
    
    // Проверяем, есть ли среди выбранных услуг те, которые требуют локацию
    const hasLocationRequiringService = formData.some(serviceId => {
      const service = serviceGroups
        .flatMap(group => group.services)
        .find(s => s.id === serviceId);
      return service?.requires_location;
    });

    // Если есть услуги, требующие локацию, и адрес не указан - показываем ошибку
    if (hasLocationRequiringService && !address.trim()) {
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
    
    // Проверяем, требуется ли локация для выбранных услуг
    const needsLocation = newSelectedServices.some(id => {
      const service = serviceGroups
        .flatMap(group => group.services)
        .find(s => s.id === id);
      return service?.requires_location;
    });

    // Если ни одна услуга не требует локацию, можно не отправлять адрес
    updateFormData({
      additionalServices: newSelectedServices,
      pickupAddress: needsLocation ? address : ''
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

  // Проверяем, есть ли среди выбранных услуг те, которые требуют локацию
  const needsLocationInput = formData.some(serviceId => {
    const service = serviceGroups
      .flatMap(group => group.services)
      .find(s => s.id === serviceId);
    return service?.requires_location;
  });

  return (
    <StyledPaper elevation={0}>
      <SectionTitle variant="h5" style={{fontWeight: "bold"}} sx={{mb: 2}}>
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
                <Box key={service.id} mb={1}>
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
        </Box>
      ))}

      {needsLocationInput && (
        <Box mt={3}>
          <TextField
            fullWidth
            label="Адрес забора груза"
            value={address}
            onChange={handleAddressChange}
            error={showErrors && !!errors.pickupAddress}
            helperText={showErrors && errors.pickupAddress}
            required
          />
        </Box>
      )}
    </StyledPaper>
  );
};

export default AdditionalServicesStep; 