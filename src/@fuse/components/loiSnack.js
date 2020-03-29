import { Button, Snackbar } from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default LoiSnack => {

  const { t } = useTranslation("welcome");

  const [open, setOpen] = React.useState(true);
  const message = t("LOI_SNACK_TEXT");
  const action = (
    <Button onClick={handleCloseMessage} color="secondary" size="small">
      {t('LOI_SNACK_CLOSE_TEXT')}
    </Button>
  );

  function handleCloseMessage() {
    setOpen(false);
  }



  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      key={`bottom,right`}
      style={{ maxWidth: "50%" }}
      open={open}
      action={action}
      // onClose={handleClose}
      message={message}
    />
  );
};
