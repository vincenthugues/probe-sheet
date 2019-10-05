import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import TargetBlock from './TargetBlock';

const TargetsList = ({
  targets,
  probes,
  comments,
  targetsTableHeaders,
  targetsCellStreaks,
  isAddingProbe,
  addingProbeToTargetId,
  probeDraft,
  isArchived,
  onProbeDraftUpdate,
  onOpenAddNewProbe,
  onConfirmAddNewProbe,
  onCancelAddNewProbe,
  onUnarchiveTarget,
}) => (
  <Fragment>
    {targets.map((target) => {
      const targetProbes = probes.filter(({ targetId }) => targetId === target.id);
      const targetComments = comments.filter(({ probeId }) => (
        targetProbes.find(({ id }) => id === probeId)
      ));

      return (
        <TargetBlock
          key={target.id}
          target={target}
          targetTableHeaders={targetsTableHeaders[target.id]}
          targetCellStreaks={targetsCellStreaks[target.id]}
          probes={targetProbes}
          isAddingProbe={isAddingProbe && addingProbeToTargetId === target.id}
          probeDraft={probeDraft}
          onProbeDraftUpdate={(fieldName, value) => onProbeDraftUpdate({
            ...probeDraft,
            [fieldName]: value,
          })}
          onOpenAddNewProbe={() => onOpenAddNewProbe(target.id)}
          onConfirmAddNewProbe={() => onConfirmAddNewProbe(probeDraft, target.id)}
          onCancelAddNewProbe={onCancelAddNewProbe}
          comments={targetComments}
          onUnarchive={() => onUnarchiveTarget(target.id)}
          isArchived={isArchived}
        />
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
  isAddingProbe: PropTypes.bool,
  addingProbeToTargetId: PropTypes.number,
  probeDraft: PropTypes.shape({}),
  isArchived: PropTypes.bool,
  onProbeDraftUpdate: PropTypes.func,
  onOpenAddNewProbe: PropTypes.func,
  onConfirmAddNewProbe: PropTypes.func,
  onCancelAddNewProbe: PropTypes.func,
  onUnarchiveTarget: PropTypes.func,
};
TargetsList.defaultProps = {
  targetsCellStreaks: {},
  isAddingProbe: false,
  addingProbeToTargetId: null,
  probeDraft: {},
  isArchived: false,
  onProbeDraftUpdate: null,
  onOpenAddNewProbe: null,
  onConfirmAddNewProbe: null,
  onCancelAddNewProbe: null,
  onUnarchiveTarget: null,
};

export default TargetsList;
