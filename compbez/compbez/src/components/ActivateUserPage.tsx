import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react-lite';
import { dataStore } from '../stores';
import { api } from '../api';
import { useHistory } from 'react-router-dom';
import './componentsStyles.css';
import { Card } from '@mui/material';

interface ActivateUserPageProps {
 userId: string;
 userName: string;
 message: undefined | string;
}

const ActivateUserPage = observer(
 ({ userId, userName, message }: ActivateUserPageProps) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] =
   useState<string>('');
  const [activateUserError, setActivateUserError] = useState<string>('');

  const history = useHistory();

  const onChangeClick = async () => {
   if (!(newPassword && newPasswordConfirmation)) {
    setActivateUserError(
     'Новый пароль или его подтверждения не должны быть пустыми строками'
    );
    return;
   }
   if (newPassword !== newPasswordConfirmation) {
    setActivateUserError('Новый пароль и его подтверждение не совпадают');
    return;
   }
   try {
    await api.changeRestricted(userId, newPassword);
    dataStore.signIn(userName, newPassword);
    history.push('/');
   } catch (error: any) {
    if (error?.response?.data) {
     setActivateUserError(error.response.data as string);
    }
   }
  };
  const onActivateClick = async () => {
   if (!(newPassword && newPasswordConfirmation)) {
    setActivateUserError(
     'Новый пароль или его подтверждения не должны быть пустыми строками'
    );
    return;
   }
   if (newPassword !== newPasswordConfirmation) {
    setActivateUserError('Новый пароль и его подтверждение не совпадают');
    return;
   }
   try {
    await api.activateUser(userId, newPassword);
    dataStore.signIn(userName, newPassword);
    history.push('/');
   } catch (error: any) {
    if (error?.response?.data) {
     setActivateUserError(error.response.data as string);
    }
   }
  };

  return (
   <div className='signIn'>
    <Card
     sx={{
      boxShadow: '4px 4px 4px 2px rgba(0, 0, 0, 0.2)',
      width: '50%',
      marginTop: '10%',
     }}>
     <Box
      sx={{
       display: 'flex',
       flexDirection: 'column',
       alignItems: 'center',
       width: '90%',
       marginLeft: '5%',
      }}>
      {activateUserError ? (
       <Typography variant='body1'>{activateUserError}</Typography>
      ) : null}
      {message ? <Typography variant='body1'>{message}</Typography> : null}
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
      />
      <TextField
       value={newPasswordConfirmation}
       onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setNewPasswordConfirmation(e.target.value)
       }
       margin='normal'
       required
       fullWidth
       label='Еще раз'
       type='password'
      />
      <Button
       onClick={message ? onChangeClick : onActivateClick}
       type='submit'
       color='success'
       variant='outlined'
       sx={{ mt: 3, mb: 2 }}>
       Активировать
      </Button>
     </Box>
    </Card>
   </div>
  );
 }
);

export { ActivateUserPage };
