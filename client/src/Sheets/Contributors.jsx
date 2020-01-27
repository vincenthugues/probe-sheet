import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import {
  Button, Form, Header, Input, Modal, Select,
} from 'semantic-ui-react';

import { ROLE_NAME } from '../constants';

const ContributorsEditor = ({ createSheetAccessRight, sheetId }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('viewer');

  return (
    <Form onSubmit={(e) => {
      if (!isEmpty(newEmail)) {
        createSheetAccessRight(sheetId, newEmail, newRole);
        setNewEmail('');
      }
      e.preventDefault();
    }}
    >
      <Input
        placeholder="email"
        icon="mail"
        iconPosition="left"
        value={newEmail}
        onChange={(e, { value }) => setNewEmail(value.trim())}
        size="small"
      />
      <Select
        value={newRole}
        onChange={(e, { value }) => setNewRole(value)}
        options={[
          { value: 'viewer', text: ROLE_NAME.viewer },
          { value: 'contributor', text: ROLE_NAME.contributor },
        ]}
        size="small"
      />
      <Button type="submit" content="Ajouter" color="teal" disabled={isEmpty(newEmail)} compact />
    </Form>
  );
};
ContributorsEditor.propTypes = {
  createSheetAccessRight: PropTypes.func.isRequired,
  sheetId: PropTypes.number.isRequired,
};

const ContributorItem = ({ email, role }) => <div>{`${email} (${ROLE_NAME[role]})`}</div>;
ContributorItem.propTypes = {
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

const Contributors = ({
  sheetAccessRights, createSheetAccessRight, sheetId, userRole,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <Modal
      trigger={<Button basic compact content="Droits d'accès" color="teal" size="mini" onClick={handleOpen} />}
      open={isModalOpen}
      onClose={handleClose}
      size="small"
    >
      <Header icon="user" content="Droits d'accès" />
      <Modal.Content>
        <Modal.Description>
          {sheetAccessRights.map(({ email, role }) => (
            <ContributorItem key={`${email}-${role}`} email={email} role={role} />
          ))}
          {userRole === 'owner' && (
            <ContributorsEditor createSheetAccessRight={createSheetAccessRight} sheetId={sheetId} />
          )}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button icon="close" content="Fermer" onClick={handleClose} />
      </Modal.Actions>
    </Modal>
  );
};
Contributors.propTypes = {
  sheetAccessRights: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  })).isRequired,
  createSheetAccessRight: PropTypes.func.isRequired,
  sheetId: PropTypes.number.isRequired,
  userRole: PropTypes.string,
};
Contributors.defaultProps = {
  userRole: null,
};

export default Contributors;
