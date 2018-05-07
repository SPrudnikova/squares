import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';

import { PlayerModel } from 'app/models';


export interface GameProps {
  winner: PlayerModel | null;
  showModal: boolean;
  close: () => void;
  restart: () => void;
}

const WinnerModal = ({ close, winner, showModal, restart }: GameProps) => {

  const modalText = winner ? <p>Winner is {winner.name}</p> : <p>There is no winner.</p>;
  return (
    <Modal show={showModal} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Game over</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalText}
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle='primary' onClick={restart}>Restart game</Button>
      </Modal.Footer>
    </Modal>
  )
};

export { WinnerModal };
