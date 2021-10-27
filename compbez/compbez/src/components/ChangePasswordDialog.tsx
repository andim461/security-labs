import React, { ChangeEvent, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react-lite';
import { dataStore } from '../stores';
import { api } from '../api';
import { useHistory } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import './componentsStyles.css';

interface ChangePasswordDialogProps {
 open: boolean;
 onClose: () => void;
 userId: string;
 userName: string;
}

const ChangePasswordDialog = observer(
 ({ open, onClose, userId, userName }: ChangePasswordDialogProps) => {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] =
   useState<string>('');
  const [changePasswordError, setChangePasswordError] = useState<string>('');

  const onPasswordChangeClick = async () => {
   if (!(oldPassword && newPassword && newPasswordConfirmation)) {
    setChangePasswordError(
     'Старый пароль, новый пароль и его подтверждение не должны быть пустыми строками'
    );
    return;
   }
   if (newPassword !== newPasswordConfirmation) {
    setChangePasswordError('Новый пароль и его подтверждение не совпадают');
    return;
   }
   try {
    await api.changePassword(userId, oldPassword, newPassword);
    dataStore.signIn(userName, newPassword);
    onClose();
   } catch (error: any) {
    if (error?.response?.data) {
     setChangePasswordError(error.response.data as string);
    }
   }
  };

  return (
   <Dialog open={open} onClose={onClose}>
    <div className='change'>
     <DialogTitle>Сменить пароль</DialogTitle>
     <DialogContent>
      {changePasswordError ? (
       <DialogContentText color='red'>{changePasswordError}</DialogContentText>
      ) : null}
      <TextField
       value={oldPassword}
       onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setOldPassword(e.target.value)
       }
       required
       fullWidth
       label='Старый пароль'
       margin='normal'
       color='success'
       type='password'
      />
      <TextField
       value={newPassword}
       onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setNewPassword(e.target.value)
       }
       required
       fullWidth
       label='Новый пароль'
       margin='normal'
       type='password'
       color='success'
      />
      <TextField
       value={newPasswordConfirmation}
       onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setNewPasswordConfirmation(e.target.value)
       }
       margin='normal'
       required
       fullWidth
       label='Повторите новый пароль'
       type='password'
       color='success'
      />
     </DialogContent>
     <DialogActions>
      <Button
       variant='outlined'
       onClick={onPasswordChangeClick}
       color='success'>
       Сменить пароль
      </Button>
     </DialogActions>
    </div>
   </Dialog>
  );
 }
);

export { ChangePasswordDialog };
