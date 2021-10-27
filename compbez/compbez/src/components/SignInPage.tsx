import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react-lite';
import { dataStore } from '../stores';
import './componentsStyles.css';

const SignInPage = observer(() => {
 const [name, setName] = useState<string>('');
 const [password, setPassword] = useState<string>('');

 const onSignInClick = () => {
  dataStore.signIn(name, password);
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
      mt: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '90%',
      marginLeft: '5%',
     }}>
     {dataStore.loginErrorMessage ? (
      <Typography color='error' variant='body1'>
       {dataStore.loginErrorMessage}
      </Typography>
     ) : null}
     <TextField
      value={name}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
       setName(e.target.value)
      }
      required
      fullWidth
      label='Логин'
      margin='normal'
      variant='outlined'
      color='success'
     />
     <TextField
      value={password}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
       setPassword(e.target.value)
      }
      margin='normal'
      required
      fullWidth
      label='Пароль'
      type='password'
      color='success'
     />
     <Button
      className='button'
      onClick={onSignInClick}
      type='submit'
      variant='outlined'
      color='success'
      sx={{ mt: 3, mb: 2 }}>
      Войти
     </Button>
    </Box>
   </Card>
  </div>
 );
});

export { SignInPage };
