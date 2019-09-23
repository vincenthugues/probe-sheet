import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isEmpty, update } from 'ramda';
// import C3Chart from 'react-c3js';

import {
  fetchProbes, createProbe, fetchComments, createComment,
} from '../apiHandler';
import { getTargetsHandler, createTargetHandler } from '../actions';
import {
  DEFAULT_BASELINE_PROBES,
  DEFAULT_DAILY_PROBES_STREAK,
  PROBE_TYPE,
  TARGETS_AUTO_ARCHIVING,
} from '../constants';
import TargetBlock from './TargetBlock';

const INITIAL_STATE = {
  probes: [],
  comments: [],

  currentUser: {
    id: 1,
    name: 'John Doe',
  },
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
    const { match, getTargets } = this.props;
    const sheetId = Number(match.params.sheetId);

    await getTargets(sheetId);
    const probes = await fetchProbes();
    const comments = await fetchComments();

    this.setState({
      probes,
      comments,
    });

    this.computeTargetsMetadata();
  }

  onOpenAddNewProbe = (selectedTargetId) => {
    const { targets } = this.props;

    this.setState(({ probes, targetsCellStreaks }) => ({
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
    const newProbe = await createProbe({
      ...probeDraft, // type, date, therapist, response, comment
      targetId: currentTargetId, // TODO
    });
    if (probeDraft.comment) {
      const newComment = await createComment(probeDraft.comment, newProbe.id);
      this.setState(state => ({
        comments: [
          ...state.comments,
          newComment,
        ],
      }));
    }

    this.setState(state => ({
      probes: [
        ...state.probes,
        newProbe,
      ],
      isAddingProbe: false,
    }));
    this.computeTargetsMetadata();
  }

  onCancelAddNewProbe = () => {
    this.setState({
      isAddingProbe: false,
    });
  }

  onAddNewTarget = async () => {
    const { match, createTarget } = this.props;
    const { targetDraft } = this.state;

    await createTarget({
      ...targetDraft,
      creationDate: Date.now(),
      ownerId: 1, // TODO
      sheetId: match.params.sheetId,
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
    const { currentUser } = this.state;

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
      therapist: currentUser.name,
      response: true,
      comment: '',
    };
  }

  // TODO: cleanup
  computeTargetsMetadata = () => {
    const { targets } = this.props;
    const { probes } = this.state;

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
    const { targets } = this.props;
    const {
      probes,
      comments,
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      sheetId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  targets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    baselineProbesNumber: PropTypes.number.isRequired,
    dailyProbesStreak: PropTypes.number.isRequired,
  })).isRequired,
  getTargets: PropTypes.func.isRequired,
  createTarget: PropTypes.func.isRequired,
};

const mapStateToProps = ({ probeSheets: { targets } }) => ({
  targets,
});

const mapDispatchToProps = dispatch => ({
  getTargets: getTargetsHandler(dispatch),
  createTarget: createTargetHandler(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataSheet);
