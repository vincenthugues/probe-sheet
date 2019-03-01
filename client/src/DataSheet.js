import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { clone, concat, isEmpty, isNil, pick } from 'ramda';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

const currentUser = {
  id: 1,
  name: 'Nia',
};

const DEFAULT_DAILY_PROBES_STREAK = 3;
const DEFAULT_BASELINE_PROBES = 3;

const PROBE_TYPE = {
  BASELINE: 'Baseline',
  DAILY: 'Daily',
  RETENTION: 'Retention',
};

const INITIAL_STATE = {
  response: '',
  post: '',
  responseToPost: '',

  isAddingTarget: false,
  targetDraft: {
    target: '',
  },
  isAddingProbe: false,
  addingProbeToTargetDataId: null,
  probeDraft: {},
  targetsData: [],
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
const NewProbeBlock = ({ probeDraft: { type, date, therapist, response, comment}, onFieldUpdate, children }) => (
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
  border: solid 1px;
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

const TargetBlock = ({ targetData: { target, probes, comments, dailyProbesStreak }, targetTableHeaders, targetCellStreaks, isAddingProbe, probeDraft, onProbeDraftUpdate, onOpenAddNewProbe, onConfirmAddNewProbe, onCancelAddNewProbe, isArchived = false }) => (
  <TargetView style={{ color: !isArchived ? '#000000' : '#B0B0B0'}}>
    <h3>{target}</h3>
    <TableBlock>
      <Table>
        <thead>
          <tr>
            <Th />
            {targetTableHeaders.map(({ type, span }, j) => (
              <Th key={j} colSpan={span} title={type === PROBE_TYPE.DAILY ? `Critère d'acquisition de ${dailyProbesStreak} réponses correctes consécutives` : null}>
                {{
                  [PROBE_TYPE.BASELINE]: 'Ligne de base',
                  [PROBE_TYPE.DAILY]: 'Probe',
                  [PROBE_TYPE.RETENTION]: 'Probe de rétention',
                }[type]}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
        <tr>
            <Th>Date</Th>
            {probes.map(({date}, i) => <Td key={i}>{date}</Td>)}
          </tr>
          <tr>
            <Th>Thérapeute</Th>
            {probes.map(({therapist}, i) => <Td key={i}>{therapist}</Td>)}
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
      ) : (
        <AddProbeButtonView onClick={onOpenAddNewProbe}>+</AddProbeButtonView>
      )}
    </TableBlock>
    <CommentsView>
      {comments.map(({ id, text }) => (
        <p key={id}>[{id}] {text}</p>
      ))}
    </CommentsView>
  </TargetView>
);

class DataSheet extends Component {
  state = INITIAL_STATE;

  componentDidMount() {
    const sheetId = this.props.match.params.sheetId;
    this.fetchTargetsData(sheetId)
      .then(targetsData => {
        this.setState({ targetsData });
        this.computeTargetsMetadata(targetsData);
      })
      .catch(err => console.log(err));
  }

  fetchTargetsData = async (sheetId) => {
    const response = await fetch(`/api/targets-data/${sheetId}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  updateTargetData = async targetData => {
    const response = await fetch(`/api/targets-data/${this.props.match.params.sheetId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetData }),
    });
    const body = await response.json();
    console.log('body', body);
  };

  computeTargetsMetadata = targetsData => {
    const targetsTableHeaders = targetsData.reduce((acc1, { id, probes }) => ({
      ...acc1,
      [id]: probes.reduce((acc2, { type }) => {
        if (acc2.length && acc2[acc2.length - 1].type === type) {
          acc2[acc2.length - 1].span++;
        } else {
          acc2.push({ type, span: 1 });
        }
        return acc2;
      }, []),
    }), {});

    // TODO: refactor targetsCellStreaks logic 
    let tmp = [];
    const targetsCellStreaks = targetsData.reduce((acc, { id, probes }) => ({
      ...acc,
      [id]: probes.map(({ type, response }, i) => {
        let count = response ? 1 : 0;
        if (response && [PROBE_TYPE.BASELINE, PROBE_TYPE.DAILY].includes(type)) {
          if (i > 0 && probes[i - 1].type === type && probes[i - 1].response === true) {
            count = tmp[i - 1];
          } else {
            while (probes[i + count] && probes[i + count].type === type && probes[i + count].response === true) {
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
    }), {});

    this.setState({
      targetsTableHeaders,
      targetsCellStreaks,
    });
  }

  getNextProbeDraft = (targetData, targetCellStreaks) => {
    const guessNextProbeType = ({ baselineProbesNumber, dailyProbesStreak, probes }, targetCellStreaks) => {
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
      type: guessNextProbeType(targetData, targetCellStreaks),
      date: (new Date()).toISOString().slice(5, 10).split('-').reverse().join('/'),
      therapist: currentUser.name,
      response: true,
      comment: '',
    };
  };

  onOpenAddNewProbe = targetDataId => this.setState({
      isAddingProbe: true,
      addingProbeToTargetDataId: targetDataId,
      probeDraft: this.getNextProbeDraft(
        this.state.targetsData.find(({ id }) => id === targetDataId),
        this.state.targetsCellStreaks[targetDataId],
      ),
  });

  onConfirmAddNewProbe = (probeDraft, targetsData, currentTargetId) => {
    let newTargetsData = clone(targetsData);
    // TODO fix this & hit api
    let nextCommentId = null;
    const targetDataIndex = newTargetsData.findIndex(({ id }) => id === currentTargetId);

    if (!isNil(probeDraft.comment) && !isEmpty(probeDraft.comment)) {
      nextCommentId = newTargetsData[targetDataIndex].comments.reduce((acc, { id }) => id >= acc ? id + 1 : acc, 1);
      newTargetsData[targetDataIndex].comments.push({
        id: nextCommentId,
        text: probeDraft.comment
      });
    }

    newTargetsData[targetDataIndex].probes.push({
      ...pick(['type', 'date', 'therapist', 'response'], probeDraft),
      ...nextCommentId ? { commentId: nextCommentId } : {},
    });

    this.setState({
      targetsData: newTargetsData,
      isAddingProbe: false,
    });

    this.updateTargetData(newTargetsData[targetDataIndex]);
    this.computeTargetsMetadata(newTargetsData);
  };

  onCancelAddNewProbe = () => {
    this.setState({
      isAddingProbe: false,
    });
  }

  onAddNewTarget = async () => {
    const { targetDraft } = this.state;

    const response = await fetch(`/api/targets-data/1`, { //userId
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sheetId: this.props.match.params.sheetId,
        targetData: targetDraft,
      }),
    });

    const newTargetData = await response.json();
    this.setState({
      targetsData: concat(this.state.targetsData, [newTargetData]),
      isAddingTarget: false,
    });
    this.computeTargetsMetadata(concat(this.state.targetsData, [newTargetData]));
  };

  render() {
    const { targetsData, isAddingTarget, targetDraft, isAddingProbe, addingProbeToTargetDataId, probeDraft, targetsTableHeaders, targetsCellStreaks } = this.state;
    
    return (
      <Fragment>
        {targetsData.filter(({ id, isArchived }) => targetsTableHeaders[id] && targetsCellStreaks[id] && !isArchived).map(targetData => (
          <TargetBlock
            key={targetData.id}
            targetData={targetData}
            targetTableHeaders={targetsTableHeaders[targetData.id]}
            targetCellStreaks={targetsCellStreaks[targetData.id]}
            isAddingProbe={isAddingProbe && addingProbeToTargetDataId === targetData.id}
            probeDraft={probeDraft}
            onProbeDraftUpdate={(fieldName, value) => this.setState({ probeDraft: { ...probeDraft, [fieldName]: value } })}
            onOpenAddNewProbe={() => this.onOpenAddNewProbe(targetData.id)}
            onConfirmAddNewProbe={() => this.onConfirmAddNewProbe(probeDraft, targetsData, targetData.id)}
            onCancelAddNewProbe={this.onCancelAddNewProbe}
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

        {targetsData.filter(({ id,isArchived }) => targetsTableHeaders[id] && targetsCellStreaks[id] && isArchived).map((targetData) => (
          <TargetBlock
            key={targetData.id}
            targetData={targetData}
            targetTableHeaders={targetsTableHeaders[targetData.id]}
            targetCellStreaks={targetsCellStreaks[targetData.id]}
            isAddingProbe={isAddingProbe && addingProbeToTargetDataId === targetData.id}
            probeDraft={probeDraft}
            onProbeDraftUpdate={(fieldName, value) => this.setState({ probeDraft: { ...probeDraft, [fieldName]: value } })}
            onOpenAddNewProbe={() => this.onOpenAddNewProbe(targetData.id)}
            onConfirmAddNewProbe={() => this.onConfirmAddNewProbe(probeDraft, targetsData, targetData.id)}
            onCancelAddNewProbe={this.onCancelAddNewProbe}
            isArchived
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
