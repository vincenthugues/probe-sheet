import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Header, Segment, Table,
} from 'semantic-ui-react';

import { PROBE_TYPE, PROBE_TABLE_HEADER_BY_TYPE } from '../constants';
import ProbeCell from './ProbeCell';
import NewProbe from './NewProbe';

const TableHeader = ({ targetTableHeaders, dailyProbesStreak }) => (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell />
      {targetTableHeaders.map(({ type, span }, idx) => (
        <Table.HeaderCell
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          colSpan={span}
          title={type === PROBE_TYPE.DAILY ? `Critère d'acquisition de ${dailyProbesStreak} réponses correctes consécutives` : null}
          textAlign="center"
        >
          {PROBE_TABLE_HEADER_BY_TYPE[type]}
        </Table.HeaderCell>
      ))}
    </Table.Row>
  </Table.Header>
);
TableHeader.propTypes = {
  dailyProbesStreak: PropTypes.number.isRequired,
  targetTableHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      span: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

const DateRow = ({ probes }) => (
  <Table.Row>
    <Table.HeaderCell>Date</Table.HeaderCell>
    {probes.map(({ id, date }) => (
      <Table.Cell key={id}>
        {new Date(date).toLocaleDateString('fr-FR')}
      </Table.Cell>
    ))}
  </Table.Row>
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
  <Table.Row>
    <Table.HeaderCell>Thérapeute</Table.HeaderCell>
    {probes.map(({ id, therapist }) => (
      <Table.Cell key={id}>
        {therapist}
      </Table.Cell>
    ))}
  </Table.Row>
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
  <Table.Row>
    <Table.HeaderCell>Réponse</Table.HeaderCell>
    {probes.map(({ id, type, response }, idx) => {
      const comment = comments.find(({ probeId }) => probeId === id);

      return (
        <ProbeCell
          key={id}
          type={type}
          response={response}
          count={targetCellStreaks[idx] || 0}
          commentIndex={comment && comments.indexOf(comment)}
          commentText={comment && comment.text}
          dailyProbesStreak={dailyProbesStreak}
        />
      );
    })}
  </Table.Row>
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
    baselineProbesNumber,
    dailyProbesStreak,
  },
  target,
  comments = [],
  probes,
  targetTableHeaders = [],
  targetCellStreaks = [],
  onCreateProbe,
  isArchived = false,
  onUnarchive,
  userRole,
  user,
}) => (
  <Container>
    <Header as="h3" content={name} textAlign="center" />
    <Table celled definition collapsing compact size="small" style={{ margin: 'auto' }}>
      <TableHeader
        targetTableHeaders={targetTableHeaders}
        dailyProbesStreak={dailyProbesStreak}
      />
      <Table.Body>
        <DateRow probes={probes} />
        <TherapistRow probes={probes} />
        <ResponseRow
          dailyProbesStreak={dailyProbesStreak}
          targetCellStreaks={targetCellStreaks}
          probes={probes}
          comments={comments}
        />
      </Table.Body>
    </Table>

    {!isArchived && ['owner', 'contributor'].includes(userRole) && (
      <Segment basic textAlign="center">
        <NewProbe
          onCreateProbe={onCreateProbe}
          user={user}
          target={target}
          targetCellStreaks={targetCellStreaks}
          probes={probes}
        />
      </Segment>
    )}

    {/* {isArchived && ['owner', 'contributor'].includes(userRole) && (
      <Button
        content="Désarchiver"
        onClick={onUnarchive}
        style={{ color: '#000000', width: 'auto' }}
      />
    )} */}

    <Container textAlign="left">
      {comments.map(({ id, text }, index) => (
        <div key={id}>
          {`[${index + 1}] ${text}`}
        </div>
      ))}
    </Container>
  </Container>
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
  onCreateProbe: PropTypes.func.isRequired,
  isArchived: PropTypes.bool,
  onUnarchive: PropTypes.func,
  userRole: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};
TargetBlock.defaultProps = {
  isArchived: false,
  onUnarchive: null,
  userRole: null,
};

export default TargetBlock;
