import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const NewTargetBlockView = styled.div`
display: flex;
flex: 0 1 auto;
flex-direction: column;

margin: 16px auto;
width: 20em;
border: 1px dashed;
`;

const NewTargetBlock = ({
  targetDraft: { name, baselineProbesNumber, dailyProbesStreak },
  onFieldUpdate,
  children,
}) => (
  <NewTargetBlockView>
    <label htmlFor="name">
      Cible
      <input id="name" value={name} onChange={({ target: { value } }) => onFieldUpdate('name', value)} />
    </label>
    <label htmlFor="baselineProbesNumber">
      Baseline #
      <input id="baselineProbesNumber" value={baselineProbesNumber} onChange={({ target: { value } }) => onFieldUpdate('baselineProbesNumber', Number(value))} />
    </label>
    <label htmlFor="dailyProbesStreak">
      Daily streak #
      <input id="dailyProbesStreak" value={dailyProbesStreak} onChange={({ target: { value } }) => onFieldUpdate('dailyProbesStreak', Number(value))} />
    </label>
    {children}
  </NewTargetBlockView>
);
NewTargetBlock.propTypes = {
  targetDraft: PropTypes.shape({
    name: PropTypes.string,
    baselineProbesNumber: PropTypes.number,
    dailyProbesStreak: PropTypes.number,
  }).isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default NewTargetBlock;
