import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

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

export default function Patient({ title, text, handleClick }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent className={classes.cardContent} onClick={handleClick}>
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
