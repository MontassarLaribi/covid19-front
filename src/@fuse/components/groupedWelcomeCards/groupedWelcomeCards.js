import React from "react";
import history from "@history";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { WelcomeCard, PatientFormModal, InformModal } from "@fuse";
import { connect } from "react-redux";
import { ModalAction } from "app/store/actions/fuse";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingTop: "5rem"
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing(2)
  }
}));

function GroupedWelcomeCards(props) {
  const classes = useStyles();
  const cardProps = [
    {
      title: "Médecin",
      text: "rnfrsgnvmol fgfgb dfgdrg sdgsrgr srgrgr dfv,fd",
      redirect: "/login",
      buttonContent: "choisissez Médecin",
      src: "assets/images/welcome/doctor.png",
      handleClick: () => {
        history.push({
          pathname: "/login"
        });
      }
    },
    {
      title: "Malade",
      text:
        "jrhglkdfms;fkgnjdiozpfk rtgrdtfgr dfgrtgrd rsgrdgtrg rtgrtgrtg jediofjenk",
      redirect: "/malade",
      buttonContent: "choisissez Malade",
      src: "assets/images/welcome/sick.png",
      handleClick: () => {
        props.ModalAction("PatientForm");
      }
    },
    {
      title: "Informer",
      text: "jkfldfbngjeopdfjr rtgdgrdg retgtrgrtd gtrdgrtd eofrleofrgjnl",
      redirect: "/informer",
      buttonContent: "choisissez d'informer",
      src: "assets/images/welcome/inform.png",
      handleClick: () => {
        props.ModalAction("Inform");
      }
    }
  ];

  return (
    <>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing="9">
            {cardProps.map(item => (
              <Grid key={item} item>
                <WelcomeCard
                  text={item.text}
                  title={item.title}
                  handleClick={item.handleClick}
                  buttonContent={item.buttonContent}
                  src={item.src}
                ></WelcomeCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <PatientFormModal modalAction={props.ModalAction} />
      <InformModal modalAction={props.ModalAction} />
    </>
  );
}

export default connect(null, { ModalAction })(GroupedWelcomeCards);
