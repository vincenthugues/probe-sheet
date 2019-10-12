import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty, prop } from 'ramda';

import { PROBE_TYPE, PROBE_TABLE_HEADER_BY_TYPE } from '../constants';
import ProbeCell from './ProbeCell';
import NewProbeBlock from './NewProbeBlock';

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
  background-color: #EAEDEF;

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

const Header = ({ targetTableHeaders, dailyProbesStreak }) => (
  <thead>
    <tr>
      <Th style={{ visibility: 'hidden' }} />
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
);
Header.propTypes = {
  dailyProbesStreak: PropTypes.number.isRequired,
  targetTableHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      span: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

const DateRow = ({ probes }) => (
  <tr>
    <Th>Date</Th>
    {probes.map(({ id: probeId, date }) => (
      <Td key={probeId}>
        {new Date(date).toLocaleDateString('fr-FR')}
      </Td>
    ))}
  </tr>
);
DateRow.propTypes = {
  probes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const TherapistRow = ({ probes }) => (
  <tr>
    <Th>Thérapeute</Th>
    {probes.map(({ id: probeId, therapist }) => (
      <Td key={probeId}>
        {therapist}
      </Td>
    ))}
  </tr>
);
TherapistRow.propTypes = {
  probes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const ResponseRow = ({
  dailyProbesStreak, targetCellStreaks, probes, comments,
}) => (
  <tr>
    <Th>Réponse</Th>
    {probes.map(({ id, type, response }, idx) => (
      <ProbeCell
        key={id}
        type={type}
        response={response}
        count={targetCellStreaks[idx] || 0}
        commentId={prop('id', comments.find(({ probeId }) => probeId === id))}
        comments={comments}
        dailyProbesStreak={dailyProbesStreak}
      />
    ))}
  </tr>
);
ResponseRow.propTypes = {
  dailyProbesStreak: PropTypes.number.isRequired,
  targetCellStreaks: PropTypes.arrayOf(PropTypes.number).isRequired,
  probes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequire,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
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
  // onUnarchive,
  userRole,
}) => (
  <TargetView style={{ color: isArchived ? '#B0B0B0' : '#000000' }}>
    <h3>{name}</h3>
    <TableBlock>
      <Table>
        <Header
          targetTableHeaders={targetTableHeaders}
          dailyProbesStreak={dailyProbesStreak}
        />
        <tbody>
          <DateRow probes={probes} />
          <TherapistRow probes={probes} />
          <ResponseRow
            dailyProbesStreak={dailyProbesStreak}
            targetCellStreaks={targetCellStreaks}
            probes={probes}
            comments={comments}
          />
        </tbody>
      </Table>

      {/* {isArchived && ['owner', 'contributor'].includes(userRole) && (
        <AddProbeButtonView
          onClick={onUnarchive}
          style={{ color: '#000000', width: 'auto' }}
        >
          Désarchiver
        </AddProbeButtonView>
      )} */}

      {isAddingProbe && ['owner', 'contributor'].includes(userRole) && (
        <NewProbeBlock probeDraft={probeDraft} onFieldUpdate={onProbeDraftUpdate}>
          <button type="button" disabled={isEmpty(probeDraft.date)} onClick={onConfirmAddNewProbe}>Confirmer</button>
          <button type="button" onClick={onCancelAddNewProbe}>Annuler</button>
        </NewProbeBlock>
      )}

      {!isArchived && !isAddingProbe && ['owner', 'contributor'].includes(userRole) && (
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
  // onUnarchive: PropTypes.func,
  userRole: PropTypes.string.isRequired,
};
TargetBlock.defaultProps = {
  isArchived: false,
  // onUnarchive: null,
};

export default TargetBlock;
