import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PROBE_TYPE } from '../constants';

const NewProbeBlockView = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;

  margin: 0 8px;
  padding: 4px;
  width: 18em;
  border: 1px dashed;
`;

const NewProbeBlock = ({
  probeDraft: {
    type, date, therapist, response, comment,
  }, onFieldUpdate, children,
}) => (
  <NewProbeBlockView>
    <div>
      Type
      <select value={type} onChange={({ target: { value } }) => onFieldUpdate('type', value)}>
        <option value={PROBE_TYPE.BASELINE}>Ligne de base</option>
        <option value={PROBE_TYPE.DAILY}>Probe</option>
        <option value={PROBE_TYPE.RETENTION}>Probe de rétention</option>
      </select>
    </div>
    <label htmlFor="date">
      Date
      <input id="date" type="date" value={date} onChange={({ target: { value } }) => onFieldUpdate('date', value.toString())} />
    </label>
    <div>
      Thérapeute
      <input value={therapist} onChange={({ target: { value } }) => onFieldUpdate('therapist', value)} />
    </div>
    <div>
      Réponse
      <select value={response} onChange={({ target: { value } }) => onFieldUpdate('response', value === 'true')}>
        <option value>Oui</option>
        <option value={false}>Non</option>
      </select>
    </div>
    <br />
    <label htmlFor="comment">
      Commentaire/Notes
      <textarea id="comment" value={comment} onChange={({ target: { value } }) => onFieldUpdate('comment', value)} />
    </label>
    <br />
    {children}
  </NewProbeBlockView>
);
NewProbeBlock.propTypes = {
  probeDraft: PropTypes.shape({
    type: PropTypes.string,
    date: PropTypes.string,
    therapist: PropTypes.string,
    response: PropTypes.bool,
    comment: PropTypes.string,
  }).isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default NewProbeBlock;
