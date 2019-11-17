import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getProbeTdBackgroundColor } from './utils';

const Td = styled.td`
  border: solid 1px;
  padding: 8px;

  max-width: 80px;
`;

const ProbeCell = ({
  type, response, count, commentIndex, commentText, dailyProbesStreak,
}) => {
  const backgroundColor = getProbeTdBackgroundColor(response, type, count, dailyProbesStreak);

  return (
    <Td style={{ backgroundColor }}>
      {response ? 'Oui' : 'Non'}
      {commentText && (
        <sup title={commentText}>{`[${commentIndex + 1}]`}</sup>
      )}
    </Td>
  );
};
ProbeCell.propTypes = {
  type: PropTypes.string.isRequired,
  response: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
  commentIndex: PropTypes.number,
  commentText: PropTypes.string,
  dailyProbesStreak: PropTypes.number.isRequired,
};
ProbeCell.defaultProps = {
  commentIndex: null,
  commentText: null,
};

export default ProbeCell;
