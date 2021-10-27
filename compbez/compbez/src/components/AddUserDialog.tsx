import React, { useState, ChangeEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import { observer } from "mobx-react-lite";
import { api } from "../api";
import Typography from "@mui/material/Typography";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddUserDialog = observer(({ open, onClose }: AddUserDialogProps) => {
  const [userName, setUserName] = useState<string>("");
  const [addUserDialogErrorMessage, setUserDialogErrorMessage] =
    useState<string>("");

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
      <DialogTitle>Добавить пользователя</DialogTitle>
      <DialogContent>
        {addUserDialogErrorMessage ? (
          <DialogContentText color="red">
            {addUserDialogErrorMessage}
          </DialogContentText>
        ) : null}
        <TextField
          value={userName}
          onChange={(
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            setUserName(e.target.value);
          }}
          autoFocus
          margin="dense"
          label="Имя нового пользователя"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onAddUser}>Добавить</Button>
      </DialogActions>
    </Dialog>
  );
});
export { AddUserDialog };
