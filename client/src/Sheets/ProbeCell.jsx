import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { getProbeTdBackgroundColor } from './utils';

const ProbeCell = ({
  type, response, count, commentIndex, commentText, dailyProbesStreak,
}) => {
  const backgroundColor = getProbeTdBackgroundColor(response, type, count, dailyProbesStreak);

  return (
    <Table.Cell style={{ backgroundColor }}>
      {response ? 'Oui' : 'Non'}
      {commentText && (
        <sup title={commentText}>{`[${commentIndex + 1}]`}</sup>
      )}
    </Table.Cell>
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
