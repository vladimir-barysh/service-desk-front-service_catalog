import { Box, createTheme, ThemeProvider } from '@mui/material';
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, LoginPage, RequestsAllPage, RequestsInWorkPage, RequestsOnConfirmPage, RequestsSuccessPage, ServicesCatalogTreePage, ServicesCatalogItCatalogPage, ServicesCatalogItServicesPage, ServicesCatalogHistoryPage, DirectoryGroupsPage, DirectoryWorktypesPage, SupportAllPage, TasksMyAllPage } from './pages';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LeftSidebar } from './sidebar/sidebar';
import { ruRU } from '@mui/material/locale';
import './styles/content.scss';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU as ruDates } from '@mui/x-date-pickers/locales';

const theme = createTheme(
  {
  },
  ruRU,
);

export const Content = () => {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs} localeText={ruDates.components.MuiLocalizationProvider.defaultProps.localeText}>
            <LeftSidebar />
            <Box className={'main'} >
              <Routes>
                <Route path="*" element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="/requests/in-work" element={<RequestsInWorkPage />} />
                <Route path="/requests/on-confirm" element={<RequestsOnConfirmPage />} />
                <Route path="/requests/success" element={<RequestsSuccessPage />} />
                <Route path="/requests/all" element={<RequestsAllPage />} />
                <Route path="/support/all" element={<SupportAllPage />} />
                <Route path="/tasks/all" element={<TasksMyAllPage />} />
                <Route path="/services_catalog/tree" element={<ServicesCatalogTreePage />} />
                <Route path="/services_catalog/itcatalog" element={<ServicesCatalogItCatalogPage />} />
                <Route path="/services_catalog/itservices" element={<ServicesCatalogItServicesPage />} />
                <Route path="/services_catalog/history" element={<ServicesCatalogHistoryPage />} />
                <Route path="/directory/groups" element={<DirectoryGroupsPage />} />
                <Route path="/directory/worktypes" element={<DirectoryWorktypesPage />} />
              </Routes>
            </Box>
          </LocalizationProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
}
