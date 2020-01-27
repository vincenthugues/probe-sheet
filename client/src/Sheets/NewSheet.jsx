import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import {
  Button, Form, Header, Modal,
} from 'semantic-ui-react';

const NewSheet = ({ onCreateSheet }) => {
  const [state, setState] = useState({
    student: '',
    skillDomain: '',
  });
  const { student, skillDomain } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e, { name, value }) => setState({ ...state, [name]: value });
  const handleOpen = () => {
    setState({ student: '', skillDomain: '' });
    setIsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);
  const handleConfirm = () => {
    onCreateSheet({ student, skillDomain });
    handleClose();
  };

  return (
    <Modal
      trigger={<Button content="Nouvelle feuille" color="teal" size="small" onClick={handleOpen} />}
      open={isModalOpen}
      onClose={handleClose}
      size="tiny"
    >
      <Header icon="file outline" content="Nouvelle feuille" />
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Input
              placeholder="Elève"
              name="student"
              icon="user"
              iconPosition="left"
              value={student}
              onChange={handleChange}
            />
            <Form.Input
              placeholder="Domaine"
              name="skillDomain"
              icon="sitemap"
              iconPosition="left"
              value={skillDomain}
              onChange={handleChange}
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button icon="checkmark" content="Confirmer" color="green" disabled={isEmpty(student) || isEmpty(skillDomain)} onClick={handleConfirm} />
        <Button icon="close" content="Annuler" onClick={handleClose} />
      </Modal.Actions>
    </Modal>
  );
};

NewSheet.propTypes = {
  onCreateSheet: PropTypes.func.isRequired,
};

export default NewSheet;
