import { Button, Snackbar } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default CharteSnack => {

  const { t } = useTranslation("welcome");

  const [open, setOpen] = React.useState(false);
  const message = t("CHARTE_SNACK_TEXT");
  const action = (
    <Button onClick={handleCloseMessage} color="secondary" size="small">
      Fermer
    </Button>
  );

  function handleCloseMessage() {
    setOpen(false);
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      key={`bottom,right`}
      style={{ maxWidth: "30%" }}
      open={open}
      action={action}
      // onClose={handleClose}
      message={message}
    />
  );
};
