import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { lensPath, set } from 'ramda';
import {
  Card, Container, Divider, Header, Segment,
} from 'semantic-ui-react';

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
import { PROBE_TYPE, TARGETS_AUTO_ARCHIVING, ROLE_NAME } from '../constants';
import {
  getTargetsTableHeaders, getTargetsCellStreaks, guessNextProbeType, getUserRole,
} from './utils';
import Contributors from './Contributors';
import TargetsList from './TargetsList';
import NewTarget from './NewTarget';

const INITIAL_STATE = {
  targetsTableHeaders: {},
  targetCellStreaks: {},
  archivedTargetsIds: [],
};

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

    const { targets } = await getTargets(sheetId);
    for (const { id: targetId } of targets) {
      const { probes } = await getProbes(targetId);
      for (const { id: probeId } of probes) {
        await getComments(probeId);
      }
    }

    this.computeTargetsMetadata();
  }

  onCreateProbe = async (targetId, probeDraft) => {
    const { createProbe, createComment } = this.props;
    const { probe } = await createProbe({
      ...probeDraft, // type, date, therapist, response, comment
      targetId,
    });

    if (probeDraft.comment) {
      await createComment(probeDraft.comment, probe.id);
    }

    this.computeTargetsMetadata();
  }

  onCreateTarget = async (targetDraft) => {
    const { user, createTarget, sheetId } = this.props;

    await createTarget({
      ...targetDraft,
      ownerId: user.id,
      sheetId,
    });
    this.computeTargetsMetadata();
  }

  onUnarchiveTarget = (targetId) => {
    this.setState(state => ({
      targets: set(
        lensPath([
          state.targets.findIndex(({ id }) => id === targetId),
          'isArchived',
        ]),
        false,
        state.targets,
      ),
    }));
  }

  getNextProbeDraft = (target, probes, targetCellStreaks) => {
    const { baselineProbesNumber, dailyProbesStreak } = target;
    return guessNextProbeType(
      baselineProbesNumber, dailyProbesStreak, targetCellStreaks, probes,
    );
  }

  computeArchivedTargetsIds = (targets, probes) => targets.reduce((acc, target) => {
    const targetProbes = probes.filter(({ targetId }) => targetId === target.id);

    if (targetProbes && targetProbes.length) {
      const lastProbe = targetProbes[targetProbes.length - 1];

      if (lastProbe.type === PROBE_TYPE.RETENTION
          && lastProbe.response === true
      ) {
        return [...acc, target.id];
      }
    }
    return acc;
  }, []);

  // TODO: cleanup
  computeTargetsMetadata = () => {
    const { targets, probes } = this.props;

    const targetsTableHeaders = getTargetsTableHeaders(targets, probes);
    const targetsCellStreaks = getTargetsCellStreaks(targets, probes);

    // toggle isArchived automatically
    if (TARGETS_AUTO_ARCHIVING) {
      const archivedTargetsIds = this.computeArchivedTargetsIds(targets, probes);
      this.setState({ archivedTargetsIds });
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
      user,
    } = this.props;
    const {
      targetsTableHeaders = {},
      targetsCellStreaks = {},
      archivedTargetsIds,
    } = this.state;
    const activeTargets = targets.filter(({ id }) => (
      !archivedTargetsIds.includes(id)
    ));
    const archivedTargets = targets.filter(({ id }) => (
      archivedTargetsIds.includes(id)
    ));

    return (
      <Fragment>
        {/* Daily probe data sheet */}
        <Header as="h2" content="Feuille de cotation quotidienne" textAlign="center" />
        <Container>
          {sheet && (
            <Card
              centered
              description={(
                <Fragment>
                  <div>{`Elève : ${sheet.student}`}</div>
                  <div>{`Domaine de compétence : ${sheet.skillDomain}`}</div>
                  {userRole && (
                    <div>
                      Role:
                      {' '}
                      {ROLE_NAME[userRole]}
                      {' '}
                      <Contributors
                        sheetAccessRights={sheetAccessRights}
                        createSheetAccessRight={createSheetAccessRight}
                        sheetId={sheetId}
                        userRole={userRole}
                      />
                    </div>
                  )}
                </Fragment>
              )}
            />
          )}
        </Container>

        <Divider hidden />

        <TargetsList
          targets={activeTargets}
          probes={probes}
          comments={comments}
          targetsTableHeaders={targetsTableHeaders}
          targetsCellStreaks={targetsCellStreaks}
          onCreateProbe={this.onCreateProbe}
          onUnarchiveTarget={this.onUnarchiveTarget}
          userRole={userRole}
          user={user}
        />
        <br />

        {['owner', 'contributor'].includes(userRole) && (
          <Segment basic textAlign="center">
            <NewTarget onCreateTarget={this.onCreateTarget} />
          </Segment>
        )}

        {archivedTargets.length ? (
          <Fragment>
            <Divider section>Archivé</Divider>
            <TargetsList
              targets={archivedTargets}
              probes={probes}
              comments={comments}
              targetsTableHeaders={targetsTableHeaders}
              targetsCellStreaks={targetsCellStreaks}
              isArchived
            />
          </Fragment>
        ) : null}
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
