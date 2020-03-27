import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const Modal = ({
  className,
  children,
  id,
  location: { pathname },
  ModalAction,
  modal
}) => {
  const handleClose = () => {
    ModalAction(id);
  };

  console.log(ModalAction, modal, id);

  return (
    <div>
      <Dialog
        open={modal.modals[id] || false}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className={className}
      >
        {children}
      </Dialog>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  location: PropTypes.object,
  ModalAction: PropTypes.func.isRequired,
  modal: PropTypes.object.isRequired
};

const mapStateToProps = ({ fuse: { modal } }) => ({
  modal
});

export default connect(mapStateToProps, {})(withRouter(Modal));
