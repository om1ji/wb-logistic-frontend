import { isTelegramApp as checkIsTelegramApp } from '../utils/telegram';

interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  close?: () => void;
  ready?: () => void;
  expand?: () => void;
  MainButton?: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
  };
  initDataUnsafe?: {
    user?: TelegramUser;
    query_id?: string;
  };
  initData?: string;
  themeParams?: {
    bg_color?: string;
    text_color?: string;
    secondary_bg_color?: string;
  }
}

interface UseTelegramResult {
  onClose: () => void;
  onToggleButton: () => void;
  tg: TelegramWebApp;
  user: TelegramUser | undefined;
  queryId: string | undefined;
  initData: string | undefined;
  isTelegramApp: boolean;
}

export function useTelegram(): UseTelegramResult {
    const tg = (window.Telegram?.WebApp || {}) as TelegramWebApp;

    const onClose = () => {
        if (typeof tg.close === 'function') {
            tg.close();
        }
    };

    const onToggleButton = () => {
        if (!tg.MainButton) return;
        
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    };

    return {
        onClose,
        onToggleButton,
        tg,
        user: tg.initDataUnsafe?.user,
        queryId: tg.initDataUnsafe?.query_id,
        initData: tg.initData,
        isTelegramApp: checkIsTelegramApp()
    };
} 