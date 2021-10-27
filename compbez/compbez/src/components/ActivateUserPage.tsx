import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { dataStore } from "../stores";
import { api } from "../api";
import { useHistory } from "react-router-dom";

interface ActivateUserPageProps {
  userId: string;
  userName: string;
  message: undefined | string;
}

const ActivateUserPage = observer(
  ({ userId, userName, message }: ActivateUserPageProps) => {
    const [newPassword, setNewPassword] = useState<string>("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] =
      useState<string>("");
    const [activateUserError, setActivateUserError] = useState<string>("");

    const history = useHistory();

    const onActivateClick = async () => {
      if (!(newPassword && newPasswordConfirmation)) {
        setActivateUserError(
          "Новый пароль или его подтверждения не должны быть пустыми строками"
        );
        return;
      }
      if (newPassword !== newPasswordConfirmation) {
        setActivateUserError("Новый пароль и его подтверждение не совпадают");
        return;
      }
      try {
        await api.activateUser(userId, newPassword);
        dataStore.signIn(userName, newPassword);
        history.push("/");
      } catch (error: any) {
        if (error?.response?.data) {
          setActivateUserError(error.response.data as string);
        }
      }
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
          {activateUserError ? (
            <Typography variant="body1">{activateUserError}</Typography>
          ) : null}
          {message ? <Typography variant="body1">{message}</Typography> : null}
          <TextField
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPassword(e.target.value)
            }
            required
            fullWidth
            label="Новый пароль"
            margin="normal"
            type="password"
          />
          <TextField
            value={newPasswordConfirmation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPasswordConfirmation(e.target.value)
            }
            margin="normal"
            required
            fullWidth
            label="Повторите новый пароль"
            type="password"
          />
          <Button
            onClick={onActivateClick}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Установить новый пароль
          </Button>
        </Box>
      </Box>
    );
  }
);

export { ActivateUserPage };
