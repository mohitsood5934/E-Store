import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ActionModal = (props) => {
  return (
    <>
      <Modal show={props.show} onHide={() => props.setShow(false)} size="md">
        <Modal.Header closeButton>
          <Modal.Title>{props.heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={props.delete}>
            {props.btnText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActionModal;
