import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isEmpty, update } from 'ramda';
// import C3Chart from 'react-c3js';

import {
  getSheetAccessRightsHandler,
  createSheetAccessRightHandler,
  getTargetsHandler,
  createTargetHandler,
  getProbesHandler,
  createProbeHandler,
  getCommentsHandler,
  createCommentHandler,
} from '../actions';
import {
  DEFAULT_BASELINE_PROBES,
  DEFAULT_DAILY_PROBES_STREAK,
  PROBE_TYPE,
  TARGETS_AUTO_ARCHIVING,
} from '../constants';
import Contributors from './Contributors';
import TargetBlock from './TargetBlock';

const INITIAL_STATE = {
  isAddingTarget: false,
  targetDraft: {
    name: '',
  },
  isAddingProbe: false,
  addingProbeToTargetId: null,
  probeDraft: {},

  targetsTableHeaders: {},
  targetCellStreaks: {},
};

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
      <input id="baselineProbesNumber" value={baselineProbesNumber} onChange={({ target: { value } }) => onFieldUpdate('baselineProbesNumber', value)} />
    </label>
    <label htmlFor="dailyProbesStreak">
      Daily streak #
      <input id="dailyProbesStreak" value={dailyProbesStreak} onChange={({ target: { value } }) => onFieldUpdate('dailyProbesStreak', value)} />
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

const SeparatorView = styled.div`
  display: block;
  overflow: hidden;
  border-style: inset;
  border-width: 1px;

  margin: 1.2em auto;
  width: 60%;
`;

const AddTargetButtonView = styled.button`
  font-size: 1.2rem;
  margin: auto 24px;
`;

class DataSheet extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  async componentDidMount() {
    const {
      getSheetAccessRights, getTargets, getProbes, getComments, sheetId,
    } = this.props;

    await getSheetAccessRights(sheetId);
    await getTargets(sheetId);
    await getProbes();
    await getComments();

    this.computeTargetsMetadata();
  }

  onOpenAddNewProbe = (selectedTargetId) => {
    const { targets, probes } = this.props;

    this.setState(({ targetsCellStreaks }) => ({
      isAddingProbe: true,
      addingProbeToTargetId: selectedTargetId,
      probeDraft: this.getNextProbeDraft(
        targets.find(({ id }) => id === selectedTargetId),
        probes.filter(({ targetId }) => targetId === selectedTargetId),
        targetsCellStreaks[selectedTargetId],
      ),
    }));
  }

  onConfirmAddNewProbe = async (probeDraft, currentTargetId) => {
    const { createProbe, createComment } = this.props;
    const { probe } = await createProbe({
      ...probeDraft, // type, date, therapist, response, comment
      targetId: currentTargetId,
    });

    if (probeDraft.comment) {
      await createComment(probeDraft.comment, probe.id);
    }

    this.setState({ isAddingProbe: false });
    this.computeTargetsMetadata();
  }

  onCancelAddNewProbe = () => this.setState({ isAddingProbe: false })

  onAddNewTarget = async () => {
    const { user, createTarget, sheetId } = this.props;
    const { targetDraft } = this.state;

    await createTarget({
      ...targetDraft,
      ownerId: user.id,
      sheetId,
    });

    this.setState({ isAddingTarget: false });
    this.computeTargetsMetadata();
  }

  // onUnarchiveTarget = (targetId) => {
  //   this.setState(state => ({
  //     targets: set(
  //       lensPath([
  //         state.targets.findIndex(({ id }) => id === targetId),
  //         'isArchived',
  //       ]),
  //       false,
  //       state.targets,
  //     ),
  //   }));
  // }

  getNextProbeDraft = (target, probes, targetCellStreaks) => {
    const { user } = this.props;

    const guessNextProbeType = ({ baselineProbesNumber, dailyProbesStreak }) => {
      if (probes.length === 0 || probes.length < baselineProbesNumber) {
        return PROBE_TYPE.BASELINE;
      }

      const prevProbe = probes[probes.length - 1];
      const prevStreak = targetCellStreaks[probes.length - 1];
      if (prevProbe.type === PROBE_TYPE.BASELINE && prevStreak >= baselineProbesNumber) {
        return PROBE_TYPE.DAILY;
      }
      if (prevProbe.type === PROBE_TYPE.DAILY && prevStreak >= dailyProbesStreak) {
        return PROBE_TYPE.RETENTION;
      }
      if (prevProbe.type === PROBE_TYPE.RETENTION && prevProbe.response === false) {
        return PROBE_TYPE.DAILY;
      }

      return PROBE_TYPE.DAILY;
    };

    return {
      type: guessNextProbeType(target),
      date: '',
      therapist: user.username,
      response: true,
      comment: '',
    };
  }

  // TODO: cleanup
  computeTargetsMetadata = () => {
    const { targets, probes } = this.props;

    const targetsTableHeaders = targets.reduce((acc1, { id }) => {
      const targetProbes = probes.filter(({ targetId }) => targetId === id);

      return {
        ...acc1,
        [id]: targetProbes.reduce((acc2, { type }) => {
          const lastItemIndex = acc2.length - 1;
          const lastItem = lastItemIndex >= 0 ? acc2[lastItemIndex] : null;
          if (lastItem && lastItem.type === type) {
            return update(
              lastItemIndex,
              {
                ...acc2[lastItemIndex],
                span: lastItem.span + 1,
              },
              acc2,
            );
          }
          return [...acc2, { type, span: 1 }];
        }, []),
      };
    }, {});

    // TODO: refactor targetsCellStreaks logic
    let counters = [];
    const targetsCellStreaks = targets.reduce((acc, { id }) => {
      const targetProbes = probes.filter(({ targetId }) => targetId === id);

      return {
        ...acc,
        [id]: targetProbes.map(({ type, response }, i) => {
          let counter = response ? 1 : 0;
          if (response && [PROBE_TYPE.BASELINE, PROBE_TYPE.DAILY].includes(type)) {
            if (
              i > 0
              && targetProbes[i - 1].type === type
              && targetProbes[i - 1].response === true
            ) {
              counter = counters[i - 1];
            } else {
              while (
                targetProbes[i + counter]
                && targetProbes[i + counter].type === type
                && targetProbes[i + counter].response === true
              ) {
                counter += 1;
              }
            }
          }

          counters = [...counters, counter];

          return counter;
        }),
      };
    }, {});

    // toggle isArchived automatically
    if (TARGETS_AUTO_ARCHIVING) {
      // const newTargets = targets.map((target) => {
      //   const targetProbes = probes.filter(({ targetId }) => targetId === target.id);

      //   if (targetProbes && targetProbes.length) {
      //     const lastProbe = targetProbes[targetProbes.length - 1];

      //     return {
      //       ...target,
      //       isArchived: (
      //         lastProbe.type === PROBE_TYPE.RETENTION
      //         && lastProbe.response === true
      //       ),
      //     };
      //   }
      //   return target;
      // });

      // this.setState({ targets: newTargets });
    }

    this.setState({
      targetsTableHeaders,
      targetsCellStreaks,
    });
  }

  render() {
    const {
      sheetAccessRights, createSheetAccessRight, targets, probes, comments, sheetId,
    } = this.props;
    const {
      isAddingTarget,
      targetDraft,
      isAddingProbe,
      addingProbeToTargetId,
      probeDraft,
      targetsTableHeaders,
      targetsCellStreaks,
    } = this.state;

    return (
      <Fragment>
        {/* <h2>Daily probe data sheet</h2> */}
        <h2>Feuille de cotation quotidienne</h2>
        <div style={{ fontSize: '1rem' }}>
          <div>Elève : J.D.</div>
          <div>Domaine de compétence : language réceptif</div>
          <br />
          <Contributors
            sheetAccessRights={sheetAccessRights}
            createSheetAccessRight={createSheetAccessRight}
            sheetId={sheetId}
          />
        </div>

        {targets.filter(
          ({ id, isArchived }) => targetsTableHeaders[id] && targetsCellStreaks[id] && !isArchived,
        ).map((target) => {
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
              onProbeDraftUpdate={(fieldName, value) => this.setState({
                probeDraft: {
                  ...probeDraft,
                  [fieldName]: value,
                },
              })}
              onOpenAddNewProbe={() => this.onOpenAddNewProbe(target.id)}
              onConfirmAddNewProbe={() => this.onConfirmAddNewProbe(probeDraft, target.id)}
              onCancelAddNewProbe={this.onCancelAddNewProbe}
              comments={targetComments}
            />
          );
        })}
        <br />

        {isAddingTarget ? (
          <NewTargetBlock
            targetDraft={targetDraft}
            onFieldUpdate={(fieldName, value) => this.setState({
              targetDraft: {
                ...targetDraft,
                [fieldName]: value,
              },
            })}
          >
            <div>
              <button type="button" disabled={isEmpty(targetDraft.name)} onClick={this.onAddNewTarget}>
                Confirmer
              </button>
              <button type="button" onClick={() => this.setState({ isAddingTarget: false })}>
                Annuler
              </button>
            </div>
          </NewTargetBlock>
        ) : (
          <AddTargetButtonView onClick={() => this.setState({ isAddingTarget: true, targetDraft: { name: '', baselineProbesNumber: DEFAULT_BASELINE_PROBES, dailyProbesStreak: DEFAULT_DAILY_PROBES_STREAK } })}>
            Nouvelle cible
          </AddTargetButtonView>
        )}

        <SeparatorView />

        {targets.filter(
          ({ id, isArchived }) => targetsTableHeaders[id] && targetsCellStreaks[id] && isArchived,
        ).map((target) => {
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
              onProbeDraftUpdate={(fieldName, value) => this.setState({
                probeDraft: {
                  ...probeDraft,
                  [fieldName]: value,
                },
              })}
              // onOpenAddNewProbe={() => this.onOpenAddNewProbe(target.id)}
              // onConfirmAddNewProbe={() => this.onConfirmAddNewProbe(probeDraft, target.id)}
              // onCancelAddNewProbe={this.onCancelAddNewProbe}
              comments={targetComments}
              onUnarchive={() => this.onUnarchiveTarget(target.id)}
              isArchived
            />
          );
        })}

        {/* <C3Chart
          style={{ maxWidth: '60%', margin: '40px auto' }}
          data={{
            labels: true,
            padding: { left: 0, right: 0 },
            axis: {
              x: { min: 1, padding: { left: 0 }, tick: { outer: false } },
              y: { min: 0, padding: { bottom: 0 }, tick: { outer: false } },
            },
            columns: [
              ['Semaine', 1, 2, 3, 4, 5, 6],
              ['Cibles retenues', 0, 4, 6, 9, 12, 13],
            ],
            x: 'Semaine',
          }}
        /> */}
      </Fragment>
    );
  }
}
DataSheet.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  sheetAccessRights: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getSheetAccessRights: PropTypes.func.isRequired,
  createSheetAccessRight: PropTypes.func.isRequired,
  targets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    baselineProbesNumber: PropTypes.number.isRequired,
    dailyProbesStreak: PropTypes.number.isRequired,
  })).isRequired,
  getTargets: PropTypes.func.isRequired,
  createTarget: PropTypes.func.isRequired,
  probes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    targetId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    therapist: PropTypes.string.isRequired,
    response: PropTypes.bool.isRequired,
  })).isRequired,
  getProbes: PropTypes.func.isRequired,
  createProbe: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    probeId: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  getComments: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
  sheetId: PropTypes.number.isRequired,
};

const mapStateToProps = (
  {
    auth: { user },
    probeSheets: {
      sheetsAccessRights, targets, probes, comments,
    },
  },
  { match: { params: { sheetId } } },
) => ({
  user,
  sheetAccessRights: sheetsAccessRights[sheetId] || [],
  targets: targets.filter(target => target.sheetId === Number(sheetId)),
  probes,
  comments,
  sheetId: Number(sheetId),
});

const mapDispatchToProps = dispatch => ({
  getSheetAccessRights: getSheetAccessRightsHandler(dispatch),
  createSheetAccessRight: createSheetAccessRightHandler(dispatch),
  getTargets: getTargetsHandler(dispatch),
  createTarget: createTargetHandler(dispatch),
  getProbes: getProbesHandler(dispatch),
  createProbe: createProbeHandler(dispatch),
  getComments: getCommentsHandler(dispatch),
  createComment: createCommentHandler(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataSheet);
