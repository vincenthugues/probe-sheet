import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty, prop } from 'ramda';

import { PROBE_TYPE, PROBE_TABLE_HEADER_BY_TYPE } from '../constants';

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

const ProbeTd = ({
  type, response, count, commentId, comments, dailyProbesStreak,
}) => {
  const getBackgroundColor = () => {
    if (!response) return 'none';

    if (type === PROBE_TYPE.DAILY && count >= dailyProbesStreak) {
      return '#FFEE55';
    }
    if (type === PROBE_TYPE.RETENTION) {
      return '#FF9DF3';
    }

    return 'none';
  };
  const commentText = commentId && comments.find(({ id }) => id === commentId).text;

  return (
    <Td style={{ backgroundColor: getBackgroundColor() }}>
      {response ? 'Oui' : 'Non'}
      {commentText && (
      <sup title={commentText}>
        [
          {commentId}
        ]
      </sup>
      )}
    </Td>
  );
};
ProbeTd.propTypes = {
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
ProbeTd.defaultProps = {
  commentId: null,
};

const NewProbeBlockView = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;

  margin: 0 8px;
  padding: 4px;
  width: 18em;
  border: 1px dashed;
`;
const NewProbeBlock = ({
  probeDraft: {
    type, date, therapist, response, comment,
  }, onFieldUpdate, children,
}) => (
  <NewProbeBlockView>
    <div>
      Type
      <select value={type} onChange={({ target: { value } }) => onFieldUpdate('type', value)}>
        <option value={PROBE_TYPE.BASELINE}>Ligne de base</option>
        <option value={PROBE_TYPE.DAILY}>Probe</option>
        <option value={PROBE_TYPE.RETENTION}>Probe de rétention</option>
      </select>
    </div>
    <label htmlFor="date">
      Date
      <input id="date" type="date" value={date} onChange={({ target: { value } }) => onFieldUpdate('date', value.toString())} />
    </label>
    <div>
      Thérapeute
      <input value={therapist} onChange={({ target: { value } }) => onFieldUpdate('therapist', value)} />
    </div>
    <div>
      Réponse
      <select value={response} onChange={({ target: { value } }) => onFieldUpdate('response', value === 'true')}>
        <option value>Oui</option>
        <option value={false}>Non</option>
      </select>
    </div>
    <br />
    <label htmlFor="comment">
      Commentaire/Notes
      <textarea id="comment" value={comment} onChange={({ target: { value } }) => onFieldUpdate('comment', value)} />
    </label>
    <br />
    {children}
  </NewProbeBlockView>
);
NewProbeBlock.propTypes = {
  probeDraft: PropTypes.shape({
    type: PropTypes.string,
    date: PropTypes.string,
    therapist: PropTypes.string,
    response: PropTypes.bool,
    comment: PropTypes.string,
  }).isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const TargetBlock = ({
  target: {
    name,
    dailyProbesStreak,
  },
  comments = [],
  probes,
  targetTableHeaders = [],
  targetCellStreaks = [],
  isAddingProbe,
  probeDraft,
  onProbeDraftUpdate,
  onOpenAddNewProbe,
  onConfirmAddNewProbe,
  onCancelAddNewProbe,
  isArchived = false,
  onUnarchive,
}) => (
  <TargetView style={{ color: isArchived ? '#B0B0B0' : '#000000' }}>
    <h3>{name}</h3>
    <TableBlock>
      <Table>
        <thead>
          <tr>
            <Th style={{ border: 0 }} />
            {targetTableHeaders.map(({ type, span }, idx) => (
              <Th
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                colSpan={span}
                title={type === PROBE_TYPE.DAILY ? `Critère d'acquisition de ${dailyProbesStreak} réponses correctes consécutives` : null}
              >
                {PROBE_TABLE_HEADER_BY_TYPE[type]}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <Th>Date</Th>
            {probes.map(({ id: probeId, date }) => (
              <Td key={probeId}>
                {new Date(date).toLocaleDateString('fr-FR')}
              </Td>
            ))}
          </tr>
          <tr>
            <Th>Thérapeute</Th>
            {probes.map(({ id: probeId, therapist }) => (
              <Td key={probeId}>
                {therapist}
              </Td>
            ))}
          </tr>
          <tr>
            <Th>Réponse</Th>
            {probes.map(({
              id: probeId, type, response,
            }, idx) => (
              <ProbeTd
                key={probeId}
                type={type}
                response={response}
                count={targetCellStreaks[idx]}
                commentId={prop('id', comments.find(comment => comment.probeId === probeId))}
                comments={comments}
                dailyProbesStreak={dailyProbesStreak}
              />
            ))}
          </tr>
        </tbody>
      </Table>

      {isArchived && (
        <AddProbeButtonView
          onClick={onUnarchive}
          style={{ color: '#000000', width: 'auto' }}
        >
      Désarchiver
        </AddProbeButtonView>
      )}
      {isAddingProbe ? (
        <NewProbeBlock probeDraft={probeDraft} onFieldUpdate={onProbeDraftUpdate}>
          <button type="button" disabled={isEmpty(probeDraft.date)} onClick={onConfirmAddNewProbe}>Confirmer</button>
          <button type="button" onClick={onCancelAddNewProbe}>Annuler</button>
        </NewProbeBlock>
      ) : (
        <AddProbeButtonView onClick={onOpenAddNewProbe}>+</AddProbeButtonView>
      )}
    </TableBlock>
    <CommentsView>
      {comments.map(({ id, text }) => (
        <div key={id}>
          {`[${id}] ${text}`}
        </div>
      ))}
    </CommentsView>
  </TargetView>
);
TargetBlock.propTypes = {
  target: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    dailyProbesStreak: PropTypes.number.isRequired,
  }).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequire,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
  probes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  targetTableHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      span: PropTypes.number.isRequired,
    }),
  ).isRequired,
  targetCellStreaks: PropTypes.arrayOf(PropTypes.number).isRequired,
  isAddingProbe: PropTypes.bool.isRequired,
  probeDraft: PropTypes.shape({
    type: PropTypes.string,
    date: PropTypes.string,
    therapist: PropTypes.string,
    response: PropTypes.bool,
    comment: PropTypes.string,
  }).isRequired,
  onProbeDraftUpdate: PropTypes.func.isRequired,
  onOpenAddNewProbe: PropTypes.func.isRequired,
  onConfirmAddNewProbe: PropTypes.func.isRequired,
  onCancelAddNewProbe: PropTypes.func.isRequired,
  isArchived: PropTypes.bool,
  onUnarchive: PropTypes.func,
};
TargetBlock.defaultProps = {
  isArchived: false,
  onUnarchive: null,
};

export default TargetBlock;
