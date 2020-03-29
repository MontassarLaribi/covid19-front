import React from "react";
import { Typography } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import logo from "../../img/logo-plain.png";
const useStyles = makeStyles(theme => ({
  root: {
    "& .logo-icon": {
      width: 24,
      height: 24,
      transition: theme.transitions.create(["width", "height"], {
        duration: theme.transitions.duration.shortest,
        easing: theme.transitions.easing.easeInOut
      })
    },
    "& .react-badge, & .logo-text": {
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shortest,
        easing: theme.transitions.easing.easeInOut
      })
    }
  },
  reactBadge: {
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#61DAFB"
  }
}));

function Logo() {
  const classes = useStyles();

  return (
    <a href="/">
      <div className={clsx(classes.root, "flex items-center")}>
        <img className="logo-icon" src={logo} alt="logo" />
        <Typography
          className="text-16 ml-12 font-light logo-text"
          color="textPrimary"
        >
          Ensemble
        </Typography>
      </div>
    </a>
  );
}

export default Logo;
