import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./NavLinkItem.module.css";

function NavLinkItem({ to, text }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? classes.active : "")}
    >
      {text}
    </NavLink>
  );
}

export default NavLinkItem;
