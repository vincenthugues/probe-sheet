import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import {
  Button, Checkbox, Form, Header, Modal, Select, TextArea, Segment,
} from 'semantic-ui-react';

import { PROBE_TYPE } from '../constants';
import { guessNextProbeType } from './utils';

const NewProbe = ({
  onCreateProbe,
  user,
  target: {
    id: targetId,
    baselineProbesNumber,
    dailyProbesStreak,
  },
  targetCellStreaks,
  probes,
}) => {
  const DEFAULT_STATE = {
    type: guessNextProbeType(
      baselineProbesNumber, dailyProbesStreak, targetCellStreaks, probes,
    ),
    date: new Date().toISOString().slice(0, 10), // yyyy-MM-dd
    therapist: user.username,
    response: false,
    comment: '',
  };
  const [state, setState] = useState(DEFAULT_STATE);
  const {
    type, date, therapist, response, comment,
  } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e, { name, value }) => setState({ ...state, [name]: value });
  const handleOpen = () => {
    setState(DEFAULT_STATE);
    setIsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);
  const handleConfirm = () => {
    onCreateProbe(targetId, {
      type, date, therapist, response, comment,
    });
    handleClose();
  };
  return (
    <Modal
      trigger={<Button icon="plus" content="Probe" color="teal" size="small" onClick={handleOpen} />}
      open={isModalOpen}
      onClose={handleClose}
      size="tiny"
    >
      <Header icon="eye dropper" content="Nouvelle probe" />
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Segment>
              <Select
                label="type"
                name="type"
                value={type}
                onChange={handleChange}
                options={[
                  { id: PROBE_TYPE.BASELINE, value: PROBE_TYPE.BASELINE, text: 'Ligne de base' },
                  { id: PROBE_TYPE.DAILY, value: PROBE_TYPE.DAILY, text: 'Probe' },
                  { id: PROBE_TYPE.RETENTION, value: PROBE_TYPE.RETENTION, text: 'Probe de rétention' },
                ]}
              />
              <Form.Input label="Date" name="date" type="date" value={date} onChange={handleChange} />
              <Form.Input label="Thérapeute" name="therapist" value={therapist} onChange={handleChange} />
              Réponse
              {' '}
              <Checkbox
                toggle
                label={response ? 'Oui' : 'Non'}
                name="response"
                checked={response}
                onChange={(e, { name, checked }) => handleChange(e, { name, value: checked })}
              />
            </Segment>
            Commentaires/notes:
            <TextArea name="comment" value={comment} onChange={handleChange} />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button icon="checkmark" content="Confirmer" color="green" disabled={isEmpty(date)} onClick={handleConfirm} />
        <Button icon="close" content="Annuler" onClick={handleClose} />
      </Modal.Actions>
    </Modal>
  );
};

NewProbe.propTypes = {
  onCreateProbe: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  target: PropTypes.shape({
    id: PropTypes.number.isRequired,
    baselineProbesNumber: PropTypes.number.isRequired,
    dailyProbesStreak: PropTypes.number.isRequired,
  }).isRequired,
  targetCellStreaks: PropTypes.arrayOf(PropTypes.number).isRequired,
  probes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default NewProbe;
