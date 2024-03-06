import React from "react";
import MainNavigation from "./Navigation/MainNavigation";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <>
      <MainNavigation />
      <Outlet />
    </>
  );
}

export default RootLayout;
