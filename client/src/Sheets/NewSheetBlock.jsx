import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const NewSheetBlockView = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
`;

const NewSheetBlock = ({ sheetDraft: { student, skillDomain }, onFieldUpdate, children }) => (
  <NewSheetBlockView>
    <label htmlFor="student">
        Elève
      <input id="student" value={student} onChange={({ target: { value } }) => onFieldUpdate('student', value)} />
    </label>
    <label htmlFor="skillDomain">
        Domaine
      <input id="skillDomain" value={skillDomain} onChange={({ target: { value } }) => onFieldUpdate('skillDomain', value)} />
    </label>
    {children}
  </NewSheetBlockView>
);

NewSheetBlock.propTypes = {
  sheetDraft: PropTypes.shape({
    student: PropTypes.string,
    skillDomain: PropTypes.string,
  }).isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default NewSheetBlock;
