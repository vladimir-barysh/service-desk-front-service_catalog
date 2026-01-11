import React from 'react';
import './App.css';
import {AuthProvider, useAuth} from "./context";
import {Content} from "./content";
import {UnauthenticatedContent} from "./unauthenticated-content";
import "@fontsource/roboto";
import {
  extendTheme as materialExtendTheme,
  CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                     // повторять 1 раз при ошибке
      staleTime: 1000 * 60 * 5,     // 5 минут данные свежие
      gcTime: 1000 * 60 * 10,       // кэш 10 минут
      refetchOnWindowFocus: false,  // не перезагружать при возврате на вкладку
    },
  },
});

function App() {
  const { user } = useAuth();

  return user ? <Content /> : <UnauthenticatedContent />;
}

const Main = () => {
  const materialTheme = materialExtendTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <App />
          </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Main;
