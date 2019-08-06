import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { concat, isEmpty, isNil, lensPath, pick, set } from 'ramda';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

import { fetchUsers, fetchTargets, createTarget, updateTarget, fetchProbes, createProbe, fetchComments } from './apiHandler';

const DEFAULT_DAILY_PROBES_STREAK = 3;
const DEFAULT_BASELINE_PROBES = 3;

const PROBE_TYPE = {
  BASELINE: 'Baseline',
  DAILY: 'Daily',
  RETENTION: 'Retention',
};

const INITIAL_STATE = {
  targets: [],
  probes: [],
  comments: [],

  currentUser: {
    id: 1,
    name: 'Nia',
  },
  isAddingTarget: false,
  targetDraft: {
    target: '',
  },
  isAddingProbe: false,
  addingProbeToTargetId: null,
  probeDraft: {},

  targetsTableHeaders: {},
  targetCellStreaks: {},
};

const TargetView = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;

  margin: 18px;
`;

const TableBlock = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;

  margin: auto;
`;

const NewProbeBlockView = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;

  margin: 0 8px;
  padding: 4px;
  width: 18em;
  border: 1px dashed;
`;
const NewProbeBlock = ({ probeDraft: { type, date, therapist, response, comment }, onFieldUpdate, children }) => (
  <NewProbeBlockView>
    <div>Type <select value={type} onChange={({ target: { value } }) => onFieldUpdate('type', value)} >
      <option value={PROBE_TYPE.BASELINE}>Ligne de base</option>
      <option value={PROBE_TYPE.DAILY}>Probe</option>
      <option value={PROBE_TYPE.RETENTION}>Probe de rétention</option>
    </select></div>
    <div>Date <input value={date} onChange={({ target: { value } }) => onFieldUpdate('date', value)} /></div>
    <div>Thérapeute<input value={therapist} onChange={({ target: { value } }) => onFieldUpdate('therapist', value)} /></div>
    <div>Réponse <select value={response} onChange={({ target: { value } }) => onFieldUpdate('response', value === 'true')}>
      <option value={true}>Oui</option>
      <option value={false}>Non</option>
    </select></div>
    <br />
    Commentaires/Notes <textarea value={comment} onChange={({ target: { value } }) => onFieldUpdate('comment', value)} />
    <br />
    {children}
  </NewProbeBlockView>
);

const NewTargetBlockView = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;

  margin: 16px auto;
  width: 20em;
  border: 1px dashed;
`;
const NewTargetBlock = ({ targetDraft: { target, baselineProbesNumber, dailyProbesStreak }, onFieldUpdate, children }) => (
  <NewTargetBlockView>
    <div>Cible <input value={target} onChange={({ target: { value } }) => onFieldUpdate('target', value)} /></div>
    <div>Baseline # <input value={baselineProbesNumber} onChange={({ target: { value } }) => onFieldUpdate('baselineProbesNumber', value)} /></div>
    <div>Daily streak # <input value={dailyProbesStreak} onChange={({ target: { value } }) => onFieldUpdate('dailyProbesStreak', value)} /></div>
    {children}
  </NewTargetBlockView>
);

const Table = styled.table`
  border-collapse: collapse;
`;

const Th = styled.th`
  border: solid 1px;
  padding: 8px;

  max-width: 120px;
`;

const Td = styled.td`
  border: solid 1px;
  padding: 8px;

  max-width: 80px;
`;

const AddProbeButtonView = styled.button`
  height: 32px;
  width: 40px;

  font-size: 1.4rem;
  margin: auto 24px;
`;

const CommentsView = styled.div`
  text-align: left;
  margin-left: 1em;
`;

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

const ProbeTd = ({ type, response, count, commentId, comments, dailyProbesStreak }) => {
  const backgroundColor = response ? (type === PROBE_TYPE.DAILY && count >= dailyProbesStreak ? '#FFEE55' : (type === PROBE_TYPE.RETENTION ? '#FF9DF3' : 'none')) : 'none';
  const commentText = commentId && comments.find(({ id }) => id === commentId).text;
  
  return (
    <Td style={{ backgroundColor }}>
      {response ? 'Oui' : 'Non'}
      {commentText && <sup title={commentText}>[{commentId}]</sup>}
    </Td>
  );
};

// params: id, target, baselineProbesNumber, dailyProbesStreak
// subres: probes
const TargetBlock = ({ target: { id, name, comments = [], dailyProbesStreak }, probes, targetTableHeaders, targetCellStreaks, isAddingProbe, probeDraft, onProbeDraftUpdate, onOpenAddNewProbe, onConfirmAddNewProbe, onCancelAddNewProbe, isArchived = false, onUnarchive, users }) => (
  <TargetView style={{ color: !isArchived ? '#000000' : '#B0B0B0'}}>
    <h3>{name}</h3>
    <TableBlock>
      <Table>
        <thead>
          <tr>
            <Th style={{ border: '20px' }} />
            {targetTableHeaders.map(({ type, span }, j) => (
              <Th key={j} colSpan={span} title={type === PROBE_TYPE.DAILY ? `Critère d'acquisition de ${dailyProbesStreak} réponses correctes consécutives` : null}>
                {{
                  [PROBE_TYPE.BASELINE]: 'Ligne de base',
                  [PROBE_TYPE.DAILY]: 'Probes',
                  [PROBE_TYPE.RETENTION]: 'Probe de rétention',
                }[type]}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
        <tr>
            <Th>Date</Th>
            {probes.map(({date}, i) => <Td key={i}>{new Date(date).toDateString()}</Td>)}
          </tr>
          <tr>
            <Th>Thérapeute</Th>
            {probes.map(({therapistId}, i) => <Td key={i}>{users.find(({id}) => id === therapistId).name}</Td>)}
          </tr>
          <tr>
            <Th>Réponse</Th>
            {probes.map(({ type, response, commentId }, k) => (
              <ProbeTd key={k} type={type} response={response} count={targetCellStreaks[k]} commentId={commentId} comments={comments} dailyProbesStreak={dailyProbesStreak} />
            ))}
          </tr>
        </tbody>
      </Table>

      {isAddingProbe ? (
        <NewProbeBlock probeDraft={probeDraft} onFieldUpdate={onProbeDraftUpdate}>
          <button disabled={isEmpty(probeDraft.date)} onClick={onConfirmAddNewProbe}>Confirmer</button>
          <button onClick={onCancelAddNewProbe}>Annuler</button>
        </NewProbeBlock>
      ) : (isArchived ? (
        <AddProbeButtonView
          onClick={onUnarchive}
          style={{ color: '#000000', width: 'auto' }}
        >
          Désarchiver
        </AddProbeButtonView>
        ) : (
          <AddProbeButtonView onClick={onOpenAddNewProbe}>+</AddProbeButtonView>
      ))}
    </TableBlock>
    <CommentsView>
      {comments.map(({ id, text }) => (
        <div key={id}>[{id}] {text}</div>
      ))}
    </CommentsView>
  </TargetView>
);

class DataSheet extends Component {
  state = INITIAL_STATE;

  componentDidMount = async () => {
    const sheetId = Number(this.props.match.params.sheetId);

    const users = await fetchUsers();
    this.setState({ users });

    const targets = await fetchTargets(sheetId);
    this.setState({ targets });
    this.computeTargetsMetadata();

    for (const { id } of targets) {
      const probes = await fetchProbes(id);
      this.setState({ probes });
      this.computeTargetsMetadata();
    }

    const comments = await fetchComments();
    this.setState({ comments });
  }

  componentDidUpdate = () => {
    console.log('STATE', this.state);
  }

  computeTargetsMetadata = () => {
    const { targets, probes } = this.state;

    const targetsTableHeaders = targets.reduce((acc1, { id }) => {
      const targetProbes = probes.filter(({ targetId }) => targetId === id);

      return {
        ...acc1,
        [id]: targetProbes.reduce((acc2, { type }) => {
          if (acc2.length && acc2[acc2.length - 1].type === type) {
            acc2[acc2.length - 1].span++;
          } else {
            acc2.push({ type, span: 1 });
          }
          return acc2;
        }, []),
      };
    }, {});

    // TODO: refactor targetsCellStreaks logic 
    let tmp = [];
    const targetsCellStreaks = targets.reduce((acc, { id }) => {
      const targetProbes = probes.filter(({ targetId }) => targetId === id);
      
      return {
        ...acc,
        [id]: targetProbes.map(({ type, response }, i) => {
          let count = response ? 1 : 0;
          if (response && [PROBE_TYPE.BASELINE, PROBE_TYPE.DAILY].includes(type)) {
            if (i > 0 && targetProbes[i - 1].type === type && targetProbes[i - 1].response === true) {
              count = tmp[i - 1];
            } else {
              while (targetProbes[i + count] && targetProbes[i + count].type === type && targetProbes[i + count].response === true) {
                count = count + 1;
              }
            }
          }

          if (i === 0) {
            tmp = [count];
          } else {
            tmp.push(count);
          }
          
          return count;
        }),
      };
    }, {});

    // toggle isArchived automatically
    const newTargets = targets.map(target => {
      const targetProbes = probes.filter(({ targetId }) => targetId === target.id);

      if (targetProbes && targetProbes.length) {
        const lastProbe = targetProbes[targetProbes.length - 1];

        target.isArchived = (lastProbe.type === PROBE_TYPE.RETENTION && lastProbe.response === true);
      }
      return target;
    });

    this.setState({
      targets: newTargets,
      targetsTableHeaders,
      targetsCellStreaks,
    });
  }

  getNextProbeDraft = (target, probes, targetCellStreaks) => {
    const guessNextProbeType = ({ baselineProbesNumber, dailyProbesStreak }, probes, targetCellStreaks) => {
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
      type: guessNextProbeType(target, probes, targetCellStreaks),
      date: (new Date()).toISOString().slice(5, 10).split('-').reverse().join('/'),
      therapist: this.state.currentUser.name,
      response: true,
      comment: '',
    };
  };

  onOpenAddNewProbe = selectedTargetId => this.setState({
      isAddingProbe: true,
      addingProbeToTargetId: selectedTargetId,
      probeDraft: this.getNextProbeDraft(
        this.state.targets.find(({ id }) => id === selectedTargetId),
        this.state.probes.filter(({ targetId }) => targetId === selectedTargetId),
        this.state.targetsCellStreaks[selectedTargetId],
      ),
  });

  onConfirmAddNewProbe = async (probeDraft, probes, targets, currentTargetId) => {
    // TODO fix this & hit api
    // let nextCommentId = null;
    // const targetIndex = targets.findIndex(({ id }) => id === currentTargetId);
    // if (!isNil(probeDraft.comment) && !isEmpty(probeDraft.comment)) {
    //   nextCommentId = targets[targetIndex].comments.reduce((acc, { id }) => id >= acc ? id + 1 : acc, 1);
    //   // targets[targetIndex].comments.push({
    //   //   id: nextCommentId,
    //   //   text: probeDraft.comment
    //   // });
    // }

    // probes.filter(({ targetId }) => targetId === targets[targetIndex].id).push({
    //   ...pick(['type', 'date', 'therapist', 'response'], probeDraft),
    //   ...nextCommentId ? { commentId: nextCommentId } : {},
    // });

    // this.setState({
    //   // target || comments
    //   probes,
    //   isAddingProbe: false,
    // });

    // updateTarget(targets[targetIndex]);
    // this.computeTargetsMetadata();

    console.log('sending probe', {
      ...probeDraft, // type, date, therapist, response, comment
      ownerId: 1, // TODO
      therapistId: 1, // TODO
      targetId: currentTargetId, // TODO
    });
    const newProbe = await createProbe({
      ...probeDraft, // type, date, therapist, response, comment
      ownerId: 1, // TODO
      therapistId: 1, // TODO
      targetId: currentTargetId, // TODO
    });
    console.log('newProbe', newProbe);

    this.setState({
      probes: [
        ...this.state.probes,
        newProbe,
      ],
      isAddingProbe: false,
    });
    this.computeTargetsMetadata();
  };

  onCancelAddNewProbe = () => {
    this.setState({
      isAddingProbe: false,
    });
  }

  onAddNewTarget = async () => {
    const { targetDraft } = this.state;
    const newTarget = await createTarget({
      ...targetDraft,
      name: targetDraft.target,
      creationDate: Date.now(),
      ownerId: 1, // TODO
      sheetId: this.props.match.params.sheetId,
    });
    console.log('newTarget', newTarget);
    
    const newTargets = concat(this.state.targets, [newTarget]);
    this.setState({
      targets: newTargets,
      isAddingTarget: false,
    });
    this.computeTargetsMetadata();
  };

  onUnarchiveTarget = targetId => this.setState({
    targets: set(
      lensPath([
        this.state.targets.findIndex(({ id }) => id === targetId),
        'isArchived',
      ]),
      false,
      this.state.targets,
    ),
  });

  render() {
    const { targets, probes, isAddingTarget, targetDraft, isAddingProbe, addingProbeToTargetId, probeDraft, targetsTableHeaders, targetsCellStreaks, users } = this.state;
    
    return (
      <Fragment>
        {targets.filter(({ id, isArchived }) => targetsTableHeaders[id] && targetsCellStreaks[id] && !isArchived).map(target => (
          <TargetBlock
            key={target.id}
            target={target}
            targetTableHeaders={targetsTableHeaders[target.id]}
            targetCellStreaks={targetsCellStreaks[target.id]}
            probes={probes.filter(({ targetId }) => targetId === target.id)}
            isAddingProbe={isAddingProbe && addingProbeToTargetId === target.id}
            probeDraft={probeDraft}
            onProbeDraftUpdate={(fieldName, value) => this.setState({ probeDraft: { ...probeDraft, [fieldName]: value } })}
            onOpenAddNewProbe={() => this.onOpenAddNewProbe(target.id)}
            onConfirmAddNewProbe={() => this.onConfirmAddNewProbe(probeDraft, probes.filter(({ targetId }) => targetId === target.id), targets, target.id)}
            onCancelAddNewProbe={this.onCancelAddNewProbe}
            users={users}
          />
        ))}
        <br />

        {isAddingTarget ? (
          <NewTargetBlock targetDraft={targetDraft} onFieldUpdate={(fieldName, value) => this.setState({ targetDraft: { ...targetDraft, [fieldName]: value } })}>
            <div>
              <button disabled={isEmpty(targetDraft.target)} onClick={this.onAddNewTarget}>
                Confirmer
              </button>
              <button onClick={() => this.setState({ isAddingTarget: false })}>
                Annuler
              </button>
            </div>
          </NewTargetBlock>
        ) : (
          <AddTargetButtonView onClick={() => this.setState({ isAddingTarget: true, targetDraft: { target: '', baselineProbesNumber: DEFAULT_BASELINE_PROBES, dailyProbesStreak: DEFAULT_DAILY_PROBES_STREAK, } })}>
            Nouvelle cible
          </AddTargetButtonView>
        )}

        <SeparatorView />

        {targets.filter(({ id, isArchived }) => targetsTableHeaders[id] && targetsCellStreaks[id] && isArchived).map((target) => (
          <TargetBlock
            key={target.id}
            target={target}
            targetTableHeaders={targetsTableHeaders[target.id]}
            targetCellStreaks={targetsCellStreaks[target.id]}
            probes={probes.filter(({ targetId }) => targetId === target.id)}
            isAddingProbe={isAddingProbe && addingProbeToTargetId === target.id}
            probeDraft={probeDraft}
            onProbeDraftUpdate={(fieldName, value) => this.setState({ probeDraft: { ...probeDraft, [fieldName]: value } })}
            // onOpenAddNewProbe={() => this.onOpenAddNewProbe(target.id)}
            // onConfirmAddNewProbe={() => this.onConfirmAddNewProbe(probeDraft, probes.filter(({ targetId }) => targetId === target.id), targets, target.id)}
            // onCancelAddNewProbe={this.onCancelAddNewProbe}
            isArchived
            onUnarchive={() => this.onUnarchiveTarget(target.id)}
            users={users}
          />
        ))}

        <C3Chart style={{ maxWidth: '60%', margin: '40px auto' }} data={{
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
        }} />
      </Fragment>
    );
  }
}

export default DataSheet;
