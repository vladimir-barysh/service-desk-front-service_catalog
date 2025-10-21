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

function App() {
  const { user } = useAuth();

  return user ? <Content /> : <UnauthenticatedContent />;
}

const Main = () => {
  const materialTheme = materialExtendTheme();

  return (
    <AuthProvider>
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <App />
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    </AuthProvider>
  );
}

export default Main;
