import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import NavLinkItem from "./NavLinkItem";
import { Add, Home } from "@mui/icons-material";

function MainNavigation() {
  const navigate = useNavigate();
  const nonMobileScreenSize = useMediaQuery("(min-width:600px)");
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              {nonMobileScreenSize
                ? "Dynamic Table Generation"
                : "SQL Generation"}
            </Typography>
            {!nonMobileScreenSize && (
              <IconButton onClick={() => navigate("/")}>
                <Home
                  sx={{
                    color: "white",
                  }}
                />
              </IconButton>
            )}
            {nonMobileScreenSize && (
              <Button>
                <NavLinkItem to={"/"} text={"Home"} />
              </Button>
            )}
            {!nonMobileScreenSize && (
              <IconButton onClick={() => navigate("/tables/new")}>
                <Add
                  sx={{
                    color: "white",
                  }}
                />
              </IconButton>
            )}
            {nonMobileScreenSize && (
              <Button>
                <NavLinkItem to={"/tables/new"} text={"Create table"} />
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default MainNavigation;
