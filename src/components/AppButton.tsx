import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import styled from 'styled-components';

// Стилизованная кнопка для приложения
const StyledButton = styled(Button)`
  background-color: #E4017D;
  color: white;
  text-transform: none;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: none;
  padding: 8px 16px;
  min-width: 120px;

  &:hover {
    background-color: #FF4DA1;
  }

  &.MuiButton-outlined {
    color: #E4017D;
    border-color: #E4017D;
    background-color: transparent;

    &:hover {
      background-color: rgba(228, 1, 125, 0.04);
      border-color: #FF4DA1;
      color: #FF4DA1;
    }
  }

  &.Mui-disabled {
    background-color: #cccccc;
    color: #666666;
    opacity: 0.7;
  }
`;

interface AppButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const AppButton: React.FC<AppButtonProps> = (props) => {
  return <StyledButton {...props} />;
};

export default AppButton; 