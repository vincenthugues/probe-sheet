import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import {
  Button, Modal, Header, Form,
} from 'semantic-ui-react';

import { DEFAULT_BASELINE_PROBES, DEFAULT_DAILY_PROBES_STREAK } from '../constants';

const DEFAULT_STATE = {
  targetName: '',
  baselineProbesNumber: DEFAULT_BASELINE_PROBES,
  dailyProbesStreak: DEFAULT_DAILY_PROBES_STREAK,
};

const NewTarget = ({ onCreateTarget }) => {
  const [state, setState] = useState(DEFAULT_STATE);
  const { targetName, baselineProbesNumber, dailyProbesStreak } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e, { name, value }) => setState({ ...state, [name]: value });
  const handleOpen = () => {
    setState(DEFAULT_STATE);
    setIsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);
  const handleConfirm = () => {
    onCreateTarget({ name: targetName, baselineProbesNumber, dailyProbesStreak });
    handleClose();
  };

  return (
    <Modal
      trigger={<Button content="Nouvelle cible" color="teal" size="small" onClick={handleOpen} />}
      open={isModalOpen}
      onClose={handleClose}
      size="tiny"
    >
      <Header icon="target" content="Nouvelle cible" />
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Input label="Cible" name="targetName" value={targetName} onChange={handleChange} />
            <Form.Input type="number" label="Nombre de lignes de base" name="baselineProbesNumber" value={baselineProbesNumber} onChange={handleChange} />
            <Form.Input type="number" label="Critère d'acquisition probes" name="dailyProbesStreak" value={dailyProbesStreak} onChange={handleChange} />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button icon="checkmark" content="Confirmer" color="green" disabled={isEmpty(targetName)} onClick={handleConfirm} />
        <Button icon="close" content="Annuler" onClick={handleClose} />
      </Modal.Actions>
    </Modal>
  );
};
NewTarget.propTypes = {
  onCreateTarget: PropTypes.func.isRequired,
};

export default NewTarget;
