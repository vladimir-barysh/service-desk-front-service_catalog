import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Grid2,
  Box,
  Tab,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Request } from './makeData';
import { SupportGeneralTab, SupportCoordinationTab, SupportDiscussionTab, 
    SupportFilesTab, SupportHistoryTab, SupportTasksTab} from '../support-tabs';

interface SupportGeneralDialogProps {
  isOpen: boolean;
  request: Request | null;
  onClose: () => void;
}

export function SupportGeneralDialog({ isOpen, request, onClose }: SupportGeneralDialogProps) {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setValue("1");
    onClose();
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle sx={{ paddingBottom: "0px" }}>
          Информация по заявке {request?.requestNumber || ''}
        </DialogTitle>
        <DialogContent sx={{ minHeight: '60vh', minWidth: '75vh' }}>
          <TabContext value={value}>
                <TabList onChange={handleChange} centered>
                <Tab label="Общие сведения" value="1"/>
                <Tab label="Файлы" value="2"/>
                <Tab label="Согласование" value="3"/>
                <Tab label="Задачи" value="4"/>
                <Tab label="Обсуждение" value="5"/>
                <Tab label="История" value="6"/>
                </TabList>
                <TabPanel value="1" sx={{ padding: "0px" }}>
                <SupportGeneralTab isOpen={true} request={request} onClose={handleClose}/>
                </TabPanel>
                <TabPanel value="2" sx={{ padding: "0px" }}>
                <SupportFilesTab request={request}/>
                </TabPanel>
                <TabPanel value="3" sx={{ padding: "0px" }}>
                <SupportCoordinationTab/>
                </TabPanel>
                <TabPanel value="4" sx={{ padding: "0px" }}>
                <SupportTasksTab/>
                </TabPanel>
                <TabPanel value="5" sx={{ padding: "0px" }}>
                <SupportDiscussionTab/>
                </TabPanel>
                <TabPanel value="6" sx={{ padding: "0px" }}>
                <SupportHistoryTab/>
                </TabPanel>
          </TabContext>
          
        </DialogContent>
      </Dialog>
    </div>
  );
}