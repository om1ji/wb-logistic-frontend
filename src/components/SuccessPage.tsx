import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Button, Container, Paper, Box } from '@mui/material';
import styled from 'styled-components';
import { CheckCircleOutline } from '@mui/icons-material';

const SuccessContainer = styled(Paper)`
  padding: 2rem;
  margin-top: 2rem;
  text-align: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SuccessIcon = styled(CheckCircleOutline)`
  color: #4caf50;
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalCost, sequenceNumber } = location.state || {};

  const handleNewOrder = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <SuccessContainer elevation={3}>
        <SuccessIcon />
        <Typography variant="h4" gutterBottom>
          🎉 Заказ успешно создан!
        </Typography>
        
        <Typography variant="body1" paragraph>
          Номер вашего заказа: <strong>№{sequenceNumber}</strong>
        </Typography>
        
        {totalCost && (
          <Typography variant="body1" paragraph>
            Общая стоимость: {totalCost} ₽
          </Typography>
        )}

        <Box mt={4}>
          <Button variant="contained" color="primary" onClick={handleNewOrder}>
            Оформить новый заказ
          </Button>
        </Box>
      </SuccessContainer>
    </Container>
  );
};

export default SuccessPage; 