import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'semantic-ui-react';

import TargetBlock from './TargetBlock';

const TargetsList = ({
  targets,
  probes,
  comments,
  targetsTableHeaders,
  targetsCellStreaks,
  isArchived,
  onCreateProbe,
  onUnarchiveTarget,
  userRole,
  user,
}) => (
  <Fragment>
    {targets.map((target) => {
      const targetProbes = probes.filter(({ targetId }) => targetId === target.id);
      const targetComments = comments.filter(({ probeId }) => (
        targetProbes.find(({ id }) => id === probeId)
      ));

      return (
        <Fragment key={target.id}>
          <TargetBlock
            target={target}
            targetTableHeaders={targetsTableHeaders[target.id] || []}
            targetCellStreaks={targetsCellStreaks[target.id] || []}
            probes={targetProbes}
            onCreateProbe={onCreateProbe}
            comments={targetComments}
            onUnarchive={() => onUnarchiveTarget(target.id)}
            isArchived={isArchived}
            userRole={userRole}
            user={user}
          />
          <Divider hidden />
        </Fragment>
      );
    })}
  </Fragment>
);

TargetsList.propTypes = {
  targets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  probes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  targetsTableHeaders: PropTypes.shape({}).isRequired,
  targetsCellStreaks: PropTypes.shape({}),
  isArchived: PropTypes.bool,
  onCreateProbe: PropTypes.func.isRequired,
  onUnarchiveTarget: PropTypes.func,
  userRole: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};
TargetsList.defaultProps = {
  targetsCellStreaks: {},
  isArchived: false,
  onUnarchiveTarget: null,
  userRole: null,
};

export default TargetsList;
