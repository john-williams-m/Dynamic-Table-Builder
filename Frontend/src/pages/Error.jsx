import { Box, Typography } from "@mui/material";
import React from "react";
import { useRouteError } from "react-router-dom";
import MainNavigation from "../shared/Navigation/MainNavigation";

function Error() {
  const error = useRouteError();
  let title = "An error occurred";
  let message = "Something went wrong!";
  if (error.status === 500) {
    message = error.data?.message || "Something went wrong";
  }
  if (error.status === 404) {
    title = "Not found!";
    message = "Could not find resource or page";
  }
  return (
    <Box>
      <MainNavigation />
      <Box display={"flex"} gap={2} flexDirection={"column"} m={"1rem 0rem"}>
        <Typography variant="h3" textAlign={"center"}>
          {title}
        </Typography>
        <Typography variant="h4" textAlign={"center"}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}

export default Error;
