import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDataStore } from "../contexts";
import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";
import { useState } from "react";

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Grid container alignItems="center" justifyContent="flex-end">
            <Grid item>
              {dataStore.currentUser ? (
                <>
                  <Button color="inherit" onClick={openUserMenu}>
                    {dataStore.currentUser.name}
                  </Button>
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={!!menuAnchorEl}
                    onClose={closeUserMenu}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={onSignOutClick}>Выйти</MenuItem>
                  </Menu>
                </>
              ) : null}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
});

export { Header };
