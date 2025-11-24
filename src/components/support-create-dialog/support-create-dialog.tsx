import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AttachFileOutlined, MessageOutlined } from '@mui/icons-material'
import { Request } from '../../pages/support/all-support/makeData';
import { fileDataClass, uploadedFiles } from '../support-tabs/support-create-dialog-files-tab/makeData'; 
import { SupportGeneralTab, SupportCoordinationTab, SupportDiscussionTab, 
    SupportFilesTab, SupportHistoryTab, SupportTasksTab} from '../support-tabs';

interface SupportGeneralDialogProps {
  isOpen: boolean;
  request: Request | null;
  onClose: () => void;
}

export function SupportGeneralDialog({ isOpen, request, onClose }: SupportGeneralDialogProps) {
  const [value, setValue] = useState('1');
  const [hasFiles, setHasFiles] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setValue("1");
    onClose();
  };

  // Функция для проверки файлов по ID заявки
  const checkFiles = () => {
    if (!request?.requestNumber) {
      setHasFiles(false);
      return;
    }

    // Ищем файлы, у которых idRequest совпадает с id заявки
    const filesForThisRequest = uploadedFiles.filter(
      file => file.idRequest === request.requestNumber
    );
    
    if (filesForThisRequest.length > 0) {
      setHasFiles(true);
    }
    else{
      setHasFiles(false);
    }
    
  };

  useEffect(() => {
    checkFiles();
  }, [request]);

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
                <Tab label="Файлы" icon={hasFiles? <AttachFileOutlined/> : undefined} iconPosition='end' value="2"/>
                <Tab label="Согласование" value="3"/>
                <Tab label="Задачи" value="4"/>
                <Tab label="Обсуждение" icon={<MessageOutlined/>} iconPosition='end' value="5"/>
                <Tab label="История" value="6"/>
                </TabList>
                <TabPanel value="1" sx={{ padding: "0px" }}>
                <SupportGeneralTab isOpen={true} request={request}/>
                </TabPanel>
                <TabPanel value="2" sx={{ padding: "0px" }}>
                <SupportFilesTab request={request}/>
                </TabPanel>
                <TabPanel value="3" sx={{ padding: "0px" }}>
                <SupportCoordinationTab request={request}/>
                </TabPanel>
                <TabPanel value="4" sx={{ padding: "0px" }}>
                <SupportTasksTab request={request}/>
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