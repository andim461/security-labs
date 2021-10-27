import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { dataStore } from "../stores";

const SignInPage = observer(() => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSignInClick = () => {
    dataStore.signIn(name, password);
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ mt: 1 }}>
        {dataStore.loginErrorMessage ? (
          <Typography variant="body1">{dataStore.loginErrorMessage}</Typography>
        ) : null}
        <TextField
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          required
          fullWidth
          label="Имя пользователя"
          margin="normal"
        />
        <TextField
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          margin="normal"
          required
          fullWidth
          label="Пароль"
          type="password"
        />
        <Button
          onClick={onSignInClick}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Войти
        </Button>
      </Box>
    </Box>
  );
});

export { SignInPage };
