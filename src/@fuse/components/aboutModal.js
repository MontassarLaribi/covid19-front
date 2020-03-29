import { Button, Modal } from "@material-ui/core";
import * as React from "react";
import aboutTxt from "../../app/page/welcome/about.txt";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  paper: {
    left: "40px",
    top: "40px",
    position: "absolute",
    width: "calc(100% - 40px * 2)",
    overflow: "auto",
    height: "calc(100% - 40px * 2)",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    [theme.breakpoints.down('sm')]: {
      top: 20,
      left: 20,
      width: "calc(100% - 20px * 2)",
      height: "calc(100% - 20px * 2)",
      padding: theme.spacing(1)
    }
  }
}));

const AboutModal = ({ close, about }) => {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  fetch(aboutTxt)
    .then(r => r.text())
    .then(text => {
      setMessage(text);
      // console.log(text);
    });

  const handleClose = () => {
    // setOpen(false);
    close();
  };

  function handleCloseMessage() {
    close();
  }
  // console.log(about);
  return (
    <Modal open={about} onClose={handleClose}>
      <div className={classes.paper}>
        <div
          className="modal-info"
          dangerouslySetInnerHTML={{ __html: message }}
        ></div>
        <Button onClick={handleCloseMessage} color="secondary" size="small">
          Fermer
        </Button>
      </div>
    </Modal>
  );
};

export default AboutModal;
