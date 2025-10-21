import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputLabel,
  TextField,
} from '@mui/material';
import { Textarea } from '@mui/joy';

export const RequestCreateDialog = (props: {
  isOpen: boolean;
  requestName: string;
  onClose: any;
}) => {

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
    >
      <DialogTitle>Новая заявка. Тип &quot;{props.requestName}&quot;</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can set my maximum width and whether to adapt or not.
        </DialogContentText>
        <FormControl style={{ width: '100%' }}>
          <DateTimePicker label="Желаемый срок" format={"YYYY.MM.DD HH:mm"} ampm={false}/>
          <InputLabel htmlFor="my-input"></InputLabel>
          <Input id="my-input" aria-describedby="my-helper-text" />
          <FormHelperText id="my-helper-text">We`&apos;ll never share your email.</FormHelperText>
          <TextField id="standard-basic" label="Standard"  />
          <FormLabel>Label</FormLabel>
          <Textarea minRows={2}>Текст ареа</Textarea>

        </FormControl>

      </DialogContent>
    </Dialog>
  );
}
