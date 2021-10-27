import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useDataStore } from "../contexts";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { AddUserDialog, ChangePasswordDialog } from "./index";
import { api } from "../api";

const MainPage = observer(() => {
  const dataStore = useDataStore();
  const [selectedUserId, setSelectedUserId] = useState<null | string>(null);
  const selectedUserData =
    selectedUserId && dataStore.usersData
      ? dataStore.usersData.find((user) => user.id === selectedUserId)
      : null;

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] =
    useState<boolean>(false);
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
    <Grid container spacing={2}>
      <Grid item xs={6}>
        {dataStore.currentUser?.isAdmin && dataStore.usersData ? (
          <Box
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: "calc(100vh - 100px)",
              }}
            >
              {dataStore.usersData.map((userData) => {
                return (
                  <li key={userData.id}>
                    <ListItemButton
                      selected={selectedUserId === userData.id}
                      onClick={() => setSelectedUserId(userData.id)}
                    >
                      <ListItemText>{userData.name}</ListItemText>
                    </ListItemButton>
                  </li>
                );
              })}
            </List>
          </Box>
        ) : null}
      </Grid>
      <Grid item container sx={{ maxHeight: "270px" }} spacing={2} xs={6}>
        <Grid item xs={12}>
          <Button
            onClick={() => onChangePasswordDialogOpen()}
            fullWidth
            variant="contained"
            size="large"
          >
            Сменить пароль текущего пользователя
          </Button>
        </Grid>
        <Divider />
        {dataStore?.currentUser?.isAdmin ? (
          <>
            {selectedUserId ? (
              <>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!selectedUserData?.isBlocked}
                        onChange={() =>
                          onSelectedUserBlockToggle(selectedUserId)
                        }
                      />
                    }
                    label="Пользователь заблокирован"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!selectedUserData?.isPasswordRestricted}
                        onChange={() =>
                          onSelectedUserPasswordRestrictedToggle(selectedUserId)
                        }
                      />
                    }
                    label="Включить ограничение на пароль"
                  />
                </Grid>
              </>
            ) : null}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => onAddUserDialogOpen()}
              >
                Добавить пользователя
              </Button>
            </Grid>
          </>
        ) : null}
      </Grid>
      {isAddUserDialogOpen ? (
        <AddUserDialog
          open={isAddUserDialogOpen}
          onClose={onAddUserDialogClose}
        />
      ) : null}
      {isChangePasswordDialogOpen && dataStore.currentUser ? (
        <ChangePasswordDialog
          open={isChangePasswordDialogOpen}
          onClose={onChangePasswordDialogClose}
          userId={dataStore.currentUser.id}
          userName={dataStore.currentUser.name}
        />
      ) : null}
    </Grid>
  );
});

export { MainPage };
