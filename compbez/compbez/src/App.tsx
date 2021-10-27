import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import {
 BrowserRouter as Router,
 Switch,
 Route,
 Redirect,
} from 'react-router-dom';
import { Header, SignInPage, MainPage, ActivateUserPage } from './components/';
import { observer } from 'mobx-react-lite';
import { useDataStore } from './contexts';
import Typography from '@mui/material/Typography';
import './index.css';
import About from './components/About';

const App = observer((): JSX.Element => {
 const dataStore = useDataStore();

 return (
  <div className='app'>
   <Router>
    <CssBaseline />
    <Header />
    <Container component='main' maxWidth='lg' style={{ marginTop: '76px' }}>
     <CssBaseline />
     <Switch>
      <Route path='/' exact>
       {dataStore.currentUser ? (
        dataStore.currentUser.isActivated &&
        (dataStore.currentUser.isPasswordValid ||
         !dataStore.currentUser.isPasswordRestricted) ? (
         dataStore.currentUser.isBlocked ? (
          <div>
           <Typography
            variant='h3'
            color='white'
            align='center'
            sx={{ marginTop: '400px' }}>
            Вас заблокировал администратор.
           </Typography>
           <Typography variant='h4' color='white' align='center'>
            Для продолжения работы обратитесь к нему.
           </Typography>
          </div>
         ) : (
          <MainPage />
         )
        ) : (
         <Redirect to='/activateUser' />
        )
       ) : (
        <Redirect to='/signIn' />
       )}
      </Route>
      <Route path='/signIn'>
       {dataStore.currentUser ? <Redirect to='/' /> : <SignInPage />}
      </Route>
      <Route path='/activateUser'>
       {dataStore.currentUser ? (
        dataStore.currentUser.isActivated &&
        (dataStore.currentUser.isPasswordValid ||
         !dataStore.currentUser.isPasswordRestricted) ? (
         <Redirect to='/' />
        ) : (
         <ActivateUserPage
          userId={dataStore.currentUser.id}
          userName={dataStore.currentUser.name}
          message={
           dataStore.currentUser.isPasswordValid ||
           !dataStore.currentUser.isPasswordRestricted
            ? undefined
            : 'Ваш текущий пароль не соответствует ограничениям'
          }
         />
        )
       ) : (
        <Redirect to='/signIn' />
       )}
      </Route>
      <Route path='/about'>
       <About />
      </Route>
     </Switch>
    </Container>
   </Router>
  </div>
 );
});

export default App;
