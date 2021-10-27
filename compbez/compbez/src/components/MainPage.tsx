import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useDataStore } from '../contexts';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { AddUserDialog, ChangePasswordDialog } from './index';
import { api } from '../api';
import './componentsStyles.css';
import { Card } from '@mui/material';

const MainPage = observer(() => {
 const dataStore = useDataStore();
 const [selectedUserId, setSelectedUserId] = useState<null | string>(null);
 const selectedUserData =
  selectedUserId && dataStore.usersData
   ? dataStore.usersData.find((user) => user.id === selectedUserId)
   : null;

 const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState<boolean>(false);
 const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
  useState<boolean>(false);

 const onAddUserDialogOpen = () => {
  setIsAddUserDialogOpen(true);
 };

 const onAddUserDialogClose = () => {
  setIsAddUserDialogOpen(false);
  dataStore.getUsers();
 };

 const onChangePasswordDialogOpen = () => {
  setIsChangePasswordDialogOpen(true);
 };

 const onChangePasswordDialogClose = () => {
  setIsChangePasswordDialogOpen(false);
 };

 const onSelectedUserBlockToggle = async (userId: string) => {
  try {
   await api.toggleBlockUser(userId);
   dataStore.getUsers();
  } catch (error) {
   console.error(error);
  }
 };

 const onSelectedUserPasswordRestrictedToggle = async (userId: string) => {
  try {
   await api.toggleRestrictedUser(userId);
   dataStore.getUsers();
  } catch (error) {
   console.error(error);
  }
 };

 return (
  <Card
   sx={{
    boxShadow: '4px 4px 4px 2px rgba(0, 0, 0, 0.2)',
    marginTop: '10%',
    minHeight: '100px',
   }}>
   <div className='mainCard'>
    <div className='mainBtns'>
     <Button
      onClick={() => onChangePasswordDialogOpen()}
      fullWidth
      variant='outlined'
      color='success'>
      Сменить пароль
     </Button>

     {dataStore?.currentUser?.isAdmin ? (
      <>
       {selectedUserId ? (
        <>
         <FormControlLabel
          control={
           <Checkbox
            checked={!!selectedUserData?.isBlocked}
            onChange={() => onSelectedUserBlockToggle(selectedUserId)}
           />
          }
          label='Заблокировать'
         />

         <FormControlLabel
          control={
           <Checkbox
            checked={!!selectedUserData?.isPasswordRestricted}
            onChange={() =>
             onSelectedUserPasswordRestrictedToggle(selectedUserId)
            }
           />
          }
          label='Ограничение на пароль'
         />
        </>
       ) : null}
       <Grid item xs={12}>
        <Button
         fullWidth
         variant='outlined'
         color='success'
         onClick={() => onAddUserDialogOpen()}>
         Добавить пользователя
        </Button>
       </Grid>
      </>
     ) : null}
    </div>
    <div>
     {dataStore.currentUser?.isAdmin && dataStore.usersData ? (
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
       <List
        sx={{
         width: '100%',
         bgcolor: 'background.paper',
         overflow: 'auto',
         maxHeight: 'calc(100vh - 100px)',
         minWidth: '300px',
        }}>
        {dataStore.usersData.map((userData) => {
         return (
          <li key={userData.id}>
           <ListItemButton
            selected={selectedUserId === userData.id}
            onClick={() => setSelectedUserId(userData.id)}>
            <ListItemText>{userData.name}</ListItemText>
           </ListItemButton>
          </li>
         );
        })}
       </List>
      </Box>
     ) : null}
    </div>
   </div>
   {isAddUserDialogOpen ? (
    <AddUserDialog open={isAddUserDialogOpen} onClose={onAddUserDialogClose} />
   ) : null}
   {isChangePasswordDialogOpen && dataStore.currentUser ? (
    <ChangePasswordDialog
     open={isChangePasswordDialogOpen}
     onClose={onChangePasswordDialogClose}
     userId={dataStore.currentUser.id}
     userName={dataStore.currentUser.name}
    />
   ) : null}
  </Card>
 );
});

export { MainPage };
