import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';

import { ROLE_NAME } from '../constants';

const ContributorsEditor = ({ createSheetAccessRight, sheetId }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('viewer');

  return (
    <div>
      <form onSubmit={(e) => {
        if (!isEmpty(newEmail)) {
          createSheetAccessRight(sheetId, newEmail, newRole);
          setNewEmail('');
        }
        e.preventDefault();
      }}
      >
        <input placeholder="email" value={newEmail} onChange={({ target: { value } }) => setNewEmail(value.trim())} />
        <select value={newRole} onChange={({ target: { value } }) => setNewRole(value)}>
          <option value="viewer">{ROLE_NAME.viewer}</option>
          <option value="contributor">{ROLE_NAME.contributor}</option>
        </select>
        <button type="submit" disabled={isEmpty(newEmail)}>Add</button>
      </form>
    </div>
  );
};
ContributorsEditor.propTypes = {
  createSheetAccessRight: PropTypes.func.isRequired,
  sheetId: PropTypes.number.isRequired,
};

const ContributorItem = ({ email, role }) => <span>{`${email} (${ROLE_NAME[role]})`}</span>;
ContributorItem.propTypes = {
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

const Contributors = ({
  sheetAccessRights, createSheetAccessRight, sheetId, userRole,
}) => (
  <Fragment>
    <div>
      <span>Droits d&#8217;accès : </span>
      {sheetAccessRights.map(({ email, role }) => (
        <ContributorItem key={`${email}-${role}`} email={email} role={role} />
      ))}
    </div>
    {userRole === 'owner' && (
      <ContributorsEditor createSheetAccessRight={createSheetAccessRight} sheetId={sheetId} />
    )}
  </Fragment>
);
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
