import { Button, Modal } from "@material-ui/core";
import * as React from "react";
import charteTxt from "../../app/page/welcome/charte.txt";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  paper: {
    left: "25%",
    position: "absolute",
    width: "50%",
    overflow: "scroll",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  content: {
    padding: 12,
    overflow: "scroll"
  }
}));

const CharteSnack = ({ close, charte }) => {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  fetch(charteTxt)
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
  // console.log(charte);
  return (
    <Modal open={charte} onClose={handleClose}>
      <div className={classes.paper}>
        <div
          className={classes.content}
          dangerouslySetInnerHTML={{ __html: message }}
        ></div>
        <Button onClick={handleCloseMessage} color="secondary" size="small">
          Fermer
        </Button>
      </div>
    </Modal>
  );
};

export default CharteSnack;
