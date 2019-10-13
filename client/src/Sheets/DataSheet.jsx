import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { isEmpty } from 'ramda';

import {
  getSheetHandler,
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
  TARGETS_AUTO_ARCHIVING,
  ROLE_NAME,
} from '../constants';
import {
  getTargetsTableHeaders, getTargetsCellStreaks, guessNextProbeType, getUserRole,
} from './utils';
import Contributors from './Contributors';
import TargetsList from './TargetsList';
import NewTargetBlock from './NewTargetBlock';

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
  state = INITIAL_STATE;

  async componentDidMount() {
    const {
      sheetId, sheet, getSheet, getSheetAccessRights, getTargets, getProbes, getComments,
    } = this.props;

    if (!sheet) {
      await getSheet(sheetId);
    }
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
    const { baselineProbesNumber, dailyProbesStreak } = target;

    return {
      type: guessNextProbeType(baselineProbesNumber, dailyProbesStreak, targetCellStreaks, probes),
      date: '',
      therapist: user.username,
      response: true,
      comment: '',
    };
  }

  // TODO: cleanup
  computeTargetsMetadata = () => {
    const { targets, probes } = this.props;

    const targetsTableHeaders = getTargetsTableHeaders(targets, probes);
    const targetsCellStreaks = getTargetsCellStreaks(targets, probes);

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
      sheet,
      sheetAccessRights,
      createSheetAccessRight,
      targets,
      probes,
      comments,
      sheetId,
      userRole,
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
    const activeTargets = targets.filter(
      ({ id, isArchived }) => targetsTableHeaders[id] && targetsCellStreaks[id] && !isArchived,
    );
    const archivedTargets = targets.filter(
      ({ id, isArchived }) => targetsTableHeaders[id] && targetsCellStreaks[id] && isArchived,
    );

    return (
      <Fragment>
        {/* <h2>Daily probe data sheet</h2> */}
        <h2>Feuille de cotation quotidienne</h2>
        <div>
          {sheet && (
            <Fragment>
              <div>{`Elève : ${sheet.student}`}</div>
              <div>{`Domaine de compétence : ${sheet.skillDomain}`}</div>
            </Fragment>
          )}
          {userRole && (
            <div>{`Role: ${ROLE_NAME[userRole]}`}</div>
          )}
          <br />
          <Contributors
            sheetAccessRights={sheetAccessRights}
            createSheetAccessRight={createSheetAccessRight}
            sheetId={sheetId}
            userRole={userRole}
          />
        </div>

        <TargetsList
          targets={activeTargets}
          probes={probes}
          comments={comments}
          targetsTableHeaders={targetsTableHeaders}
          targetsCellStreaks={targetsCellStreaks}
          isAddingProbe={isAddingProbe}
          addingProbeToTargetId={addingProbeToTargetId}
          probeDraft={probeDraft}
          onProbeDraftUpdate={newDraft => this.setState({ probeDraft: newDraft })}
          onOpenAddNewProbe={this.onOpenAddNewProbe}
          onConfirmAddNewProbe={this.onConfirmAddNewProbe}
          onCancelAddNewProbe={this.onCancelAddNewProbe}
          onUnarchiveTarget={this.onUnarchiveTarget}
          userRole={userRole}
        />
        <br />

        {['owner', 'contributor'].includes(userRole) && (
          isAddingTarget ? (
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
          )
        )}

        <SeparatorView />

        <TargetsList
          targets={archivedTargets}
          probes={probes}
          comments={comments}
          targetsTableHeaders={targetsTableHeaders}
          targetsCellStreaks={targetsCellStreaks}
          isArchived
        />
      </Fragment>
    );
  }
}
DataSheet.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  sheetId: PropTypes.number.isRequired,
  sheet: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ownerId: PropTypes.number.isRequired,
    student: PropTypes.string.isRequired,
    skillDomain: PropTypes.string.isRequired,
  }),
  getSheet: PropTypes.func.isRequired,
  sheetAccessRights: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  })).isRequired,
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
  userRole: PropTypes.string,
};
DataSheet.defaultProps = {
  sheet: null,
  userRole: null,
};

const mapStateToProps = (
  {
    auth: { user },
    probeSheets: {
      sheets,
      sheetsAccessRights,
      targets,
      probes,
      comments,
    },
  },
  { match: { params: { sheetId } } },
) => {
  const id = Number(sheetId);
  const sheet = sheets.find(s => s.id === id);
  const sheetAccessRights = sheetsAccessRights[id] || [];
  const userRole = sheet ? getUserRole(sheet, user, sheetAccessRights) : null;

  return ({
    user,
    sheetId: id,
    sheet,
    sheetAccessRights,
    targets: targets.filter(target => target.sheetId === id),
    probes,
    comments,
    userRole,
  });
};

const mapDispatchToProps = dispatch => ({
  getSheet: getSheetHandler(dispatch),
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
