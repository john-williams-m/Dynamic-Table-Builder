import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DialogBox({
  modalOpen,
  handleClose,
  title,
  content,
  confirmButtonColor,
  confirmText,
  handleRequest,
}) {
  return (
    <>
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color={`${confirmButtonColor}`}
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color={`${confirmButtonColor}`}
            onClick={handleRequest}
            autoFocus
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
