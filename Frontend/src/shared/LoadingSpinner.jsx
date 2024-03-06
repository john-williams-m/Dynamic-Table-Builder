import { Box, CircularProgress } from "@mui/material";
import React from "react";

function LoadingSpinner() {
  return (
    <Box
      sx={{
        margin: "1rem 0rem",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default LoadingSpinner;
