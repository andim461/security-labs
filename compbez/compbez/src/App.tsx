import React from "react";
import { Container, CssBaseline } from "@mui/material";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Header, SignInPage, MainPage, ActivateUserPage } from "./components/";
import { observer } from "mobx-react-lite";
import { useDataStore } from "./contexts";
import Typography from "@mui/material/Typography";

const App = observer((): JSX.Element => {
  const dataStore = useDataStore();

  return (
    <Router>
      <CssBaseline />
      <Header />
      <Container component="main" maxWidth="lg" style={{ marginTop: "76px" }}>
        <CssBaseline />
        <Switch>
          <Route path="/" exact>
            {dataStore.currentUser ? (
              dataStore.currentUser.isActivated ? (
                dataStore.currentUser.isBlocked ? (
                  <Typography variant="h3" color="red" align="center">
                    Вы заблокированы
                  </Typography>
                ) : (
                  <MainPage />
                )
              ) : (
                <Redirect to="/activateUser" />
              )
            ) : (
              <Redirect to="/signIn" />
            )}
          </Route>
          <Route path="/signIn">
            {dataStore.currentUser ? <Redirect to="/" /> : <SignInPage />}
          </Route>
          <Route path="/activateUser">
            {dataStore.currentUser ? (
              dataStore.currentUser.isActivated ? (
                <Redirect to="/" />
              ) : (
                <ActivateUserPage
                  userId={dataStore.currentUser.id}
                  userName={dataStore.currentUser.name}
                />
              )
            ) : (
              <Redirect to="/signIn" />
            )}
          </Route>
        </Switch>
      </Container>
    </Router>
  );
});

export default App;
