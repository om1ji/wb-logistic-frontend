import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Fade } from '@mui/material'
import styled from 'styled-components'
import Calculator from './components/Calculator'
import SuccessPage from './components/SuccessPage'
import { useTelegram } from './hooks/useTelegram'
import './App.css'

const MainContent = styled.main`
  background-color: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
  height: 100vh;
`

const Hero = styled.section`
  background: linear-gradient(135deg, #E4017D 0%, #A601B4 100%);
  color: white;
  text-align: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    font-weight: 500;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
  }
`

const CalculateButton = styled.button`
  background-color: white;
  color: #E4017D;
  border: none;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`

function App() {
  const { tg, user, isTelegramApp } = useTelegram();
  const [darkMode, setDarkMode] = useState(false)
  const [showHero, setShowHero] = useState(!isTelegramApp);
  const [showCalculator, setShowCalculator] = useState(isTelegramApp);

  useEffect(() => {
    if (isTelegramApp && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready?.();
      webApp.expand?.();
      
      // Логирование информации о пользователе для отладки
      console.log("Telegram user info:", user);
      console.log("Telegram init data:", webApp.initData);
      console.log("Telegram theme params:", webApp.themeParams);
      
      // Адаптируем интерфейс для Telegram
      if (webApp.themeParams) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.themeParams.bg_color || '#fff');
        document.documentElement.style.setProperty('--tg-theme-text-color', webApp.themeParams.text_color || '#000');
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', webApp.themeParams.secondary_bg_color || '#f5f5f5');
      }
    }
  }, [isTelegramApp, user]);

  const handleCalculateClick = () => {
    setShowHero(false);
    // Небольшая задержка перед показом калькулятора для плавности анимации
    setTimeout(() => setShowCalculator(true), 300);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#E4017D',
        light: '#FF4DA1',
        dark: '#B1015F',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#A601B4',
        light: '#D601E8',
        dark: '#7A0086',
        contrastText: '#ffffff',
      },
      background: {
        default: '#F5F5F5',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#333333',
        secondary: '#666666',
        disabled: '#999999',
      },
      error: {
        main: '#FF3B30',
      },
      success: {
        main: '#34C759',
      },
      warning: {
        main: '#FF9500',
      },
      info: {
        main: '#007AFF',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">       
          <MainContent>
            {showHero && (
              <Fade in={showHero} timeout={300} unmountOnExit>
                <Hero>
                  <HeroContent>
                    <h1>Расчёт стоимости отправки груза на склады Wildberries, Яндекс.Маркет, Ozon</h1>
                    <CalculateButton onClick={handleCalculateClick}>
                      Рассчитать
                    </CalculateButton>
                  </HeroContent>
                </Hero>
              </Fade>
            )}
            
            {showCalculator && (
              <Fade in={showCalculator} timeout={300}>
                <div>
                  <Calculator telegramUser={user} />
                </div>
              </Fade>
            )}
            
            {!showHero && !showCalculator && (
              <Routes>
                <Route path="/" element={<Calculator telegramUser={user} />} />
                <Route path="/success" element={<SuccessPage />} />
              </Routes>
            )}
          </MainContent>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
