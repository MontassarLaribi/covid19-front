import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { CardActions } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 200,
    minWidth: 100,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "5px",
    marginBottom: "5px"
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto"
  },

  text: {
    textAlign: "center"
  },
  title: {
    textAlign: "left",
    textTransform: "uppercase",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#596377",
    fontFamily: "Manrope",
    letterSpacing: ".425px"
  },
  button: {}
});

function renderFlag(flag) {
  if (flag) {
    switch (flag.toLowerCase()) {
      case "suspect":
        return <Chip color="primary" label={flag} />;
      case "stable":
        return <Chip color="secondary" label={flag} />;
      case "urgent":
        return <Chip style={{ backgroundColor: "darkred" }} label={flag} />;
      default:
        break;
    }
  }
}

export default function Patient({ title, text, flag, handleClick }) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={handleClick}>
        <CardContent className={classes.cardContent}>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={classes.title}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            className={classes.text}
          >
            {text}
          </Typography>
          {flag && renderFlag(flag)}
        </CardContent>
        <CardActions></CardActions>
      </CardActionArea>
    </Card>
  );
}
