import { Box, createTheme, ThemeProvider } from '@mui/material';
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, LoginPage, RequestsAllPage, 
  ServicesCatalogTreePage, ServicesCatalogItCatalogPage, ServicesCatalogItServicesPage, 
  ServicesCatalogHistoryPage, DirectoryGroupsPage, DirectoryWorktypesPage,
  SupportAllPage, ManualPage, SchedulePage,
  ProfilePage, WebServicesPage, ItCatalogPage,
  KnowBasePage, NotificationsPage, ReferencePage } from './pages';
import { TasksMyAllPage } from './pages/tasks/all-tasks/tasks-my-all.page';
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
                <Route path="/requests/all" element={<RequestsAllPage />} />
                <Route path="/support/all" element={<SupportAllPage />} />
                <Route path="/tasks/all" element={<TasksMyAllPage />} />
                <Route path="/services_catalog/tree" element={<ServicesCatalogTreePage />} />
                <Route path="/services_catalog/itcatalog" element={<ServicesCatalogItCatalogPage />} />
                <Route path="/services_catalog/itservices" element={<ServicesCatalogItServicesPage />} />
                <Route path="/services_catalog/history" element={<ServicesCatalogHistoryPage />} />
                <Route path="/admin/manual" element={<ManualPage/>} />
                <Route path="/admin/schedule" element={<SchedulePage/>} />
                <Route path="/info/profile" element={<ProfilePage/>} />
                <Route path="/info/webservices" element={<WebServicesPage/>} />
                <Route path="/info/itcatalog" element={<ItCatalogPage/>} />
                <Route path="/info/knowbase" element={<KnowBasePage/>} />
                <Route path="/info/notifications" element={<NotificationsPage/>} />
                <Route path="/info/reference" element={<ReferencePage/>} />
                <Route path="/directory/groups" element={<DirectoryGroupsPage />} />
                <Route path="/directory/worktypes" element={<DirectoryWorktypesPage />} />
              </Routes>
            </Box>
          </LocalizationProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
}
