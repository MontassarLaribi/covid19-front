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
  hide: {
    display: "none"
  },
  text: {
    textAlign: "center"
  },
  title: {
    textAlign: "center",
    fontfamily: "unset",
    textTransform: "capitalize",
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
        return (
          <Chip
            style={{
              backgroundColor: "orange",
              height: "20px",
              fontSize: "1rem"
            }}
            label={flag}
          />
        );
      case "stable":
        return (
          <Chip
            color="secondary"
            style={{ height: "20px", fontSize: "1rem" }}
            label={flag}
          />
        );
      case "urgent":
        return (
          <Chip
            style={{
              backgroundColor: "#e23b42",
              height: "20px",
              fontSize: "1rem"
            }}
            label={flag}
          />
        );
      default:
        break;
    }
  }
}
function renderFlagStatus(flag, positive) {
  if (flag) {
    switch (flag) {
      case "TO_BE_TESTED":
        return (
          <Chip
            style={{
              backgroundColor: "orange",
              height: "20px",
              fontSize: "1rem"
            }}
            label="à Testé"
          />
        );
      case "NOT_TO_BE_TESTED":
        return (
          <Chip
            color="secondary"
            style={{ height: "20px", fontSize: "1rem" }}
            label="Pas de test"
          />
        );
      case "TESTED":
        if (positive === false) {
          return (
            <Chip
              color="secondary"
              style={{
                height: "20px",
                fontSize: "1rem"
              }}
              label="Déjà Testé"
            />
          );
        } else {
          return (
            <Chip
              style={{
                backgroundColor: "#e23b42",
                height: "20px",
                fontSize: "1rem"
              }}
              label="Déjà Testé"
            />
          );
        }

      default:
        break;
    }
  }
}

export default function Patient({
  title,
  text,
  guid,
  flag,
  handleClick,
  search,
  medicalStatus,
  positive
}) {
  const classes = useStyles();
  function isSearchValid(search) {
    const searchRegex = new RegExp(`${search}`, "gi");
    return (
      !title ||
      String(title).search(searchRegex) > -1 ||
      !text ||
      String(text).search(searchRegex) > -1 ||
      !flag ||
      String(flag).search(searchRegex) > -1 ||
      !guid ||
      String(guid).search(searchRegex) > -1
    );
  }

  return (
    <Card className={isSearchValid(search) ? classes.root : classes.hide}>
      <CardActionArea onClick={handleClick}>
        <CardContent className={classes.cardContent}>
          {medicalStatus && renderFlagStatus(medicalStatus, positive)}
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
            {guid} - {text}
          </Typography>
          {flag && renderFlag(flag)}
        </CardContent>
        <CardActions></CardActions>
      </CardActionArea>
    </Card>
  );
}
