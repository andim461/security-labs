import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDataStore } from '../contexts';
import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './componentsStyles.css';

const theme = createTheme({
 components: {
  MuiAppBar: {
   styleOverrides: {
    root: {
     background: 'linear-gradient(45deg, #c8ff00 30%, #29ac09 90%)',
    },
   },
  },
 },
});

const Header = observer(() => {
 const dataStore = useDataStore();
 const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

 const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
  setMenuAnchorEl(event.currentTarget);
 };

 const closeUserMenu = () => {
  setMenuAnchorEl(null);
 };

 const onSignOutClick = () => {
  dataStore.signOut();
  closeUserMenu();
 };

 return (
  <ThemeProvider theme={theme}>
   <Box
    sx={{
     flexGrow: 1,
    }}>
    <AppBar color='secondary'>
     <Toolbar>
      <Grid container alignItems='center' justifyContent='flex-start'>
       <Grid item>
        {dataStore.currentUser ? (
         <>
          <Button color='primary' variant='outlined' onClick={openUserMenu}>
           {dataStore.currentUser.name}
          </Button>
          <Menu
           anchorEl={menuAnchorEl}
           open={!!menuAnchorEl}
           onClose={closeUserMenu}
           MenuListProps={{
            'aria-labelledby': 'basic-button',
           }}>
           <MenuItem onClick={onSignOutClick}>Выйти</MenuItem>
          </Menu>
         </>
        ) : null}
       </Grid>
      </Grid>
     </Toolbar>
    </AppBar>
   </Box>
  </ThemeProvider>
 );
});

export { Header };
