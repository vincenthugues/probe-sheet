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
  type, response, count, commentId, comments, dailyProbesStreak,
}) => {
  const commentText = commentId && comments.find(({ id }) => id === commentId).text;
  const backgroundColor = getProbeTdBackgroundColor(response, type, count, dailyProbesStreak);

  return (
    <Td style={{ backgroundColor }}>
      {response ? 'Oui' : 'Non'}
      {commentText && (
        <sup title={commentText}>{`[${commentId}]`}</sup>
      )}
    </Td>
  );
};
ProbeCell.propTypes = {
  type: PropTypes.string.isRequired,
  response: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
  commentId: PropTypes.number,
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  dailyProbesStreak: PropTypes.number.isRequired,
};
ProbeCell.defaultProps = {
  commentId: null,
};

export default ProbeCell;
