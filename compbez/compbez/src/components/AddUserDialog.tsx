import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import { observer } from 'mobx-react-lite';
import { api } from '../api';
import Typography from '@mui/material/Typography';
import './componentsStyles.css';

interface AddUserDialogProps {
 open: boolean;
 onClose: () => void;
}

const AddUserDialog = observer(({ open, onClose }: AddUserDialogProps) => {
 const [userName, setUserName] = useState<string>('');
 const [addUserDialogErrorMessage, setUserDialogErrorMessage] =
  useState<string>('');

 const onAddUser = async () => {
  try {
   await api.addUser(userName);
   onClose();
  } catch (error: any) {
   if (error?.response?.data) {
    setUserDialogErrorMessage(error.response.data as string);
   }
  }
 };

 return (
  <Dialog open={open} onClose={onClose}>
   <div className='change'>
    <DialogTitle>Добавить пользователя</DialogTitle>
    <DialogContent>
     {addUserDialogErrorMessage ? (
      <DialogContentText color='red'>
       {addUserDialogErrorMessage}
      </DialogContentText>
     ) : null}
     <TextField
      value={userName}
      onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
       setUserName(e.target.value);
      }}
      autoFocus
      margin='dense'
      label='Логин'
      fullWidth
      color='success'
      variant='outlined'
     />
    </DialogContent>
    <DialogActions>
     <Button variant='outlined' color='success' onClick={onAddUser}>
      Добавить
     </Button>
    </DialogActions>
   </div>
  </Dialog>
 );
});
export { AddUserDialog };
