import React from 'react';
import PropTypes from 'prop-types';
import { Button, Segment, Select } from 'semantic-ui-react';

const Filters = ({
  filters, students, skillDomains, onUpdate, onClear,
}) => (
  <Segment basic textAlign="center">
    Filtres:
    <Select
      placeholder="Elève"
      value={filters.student}
      onChange={(e, { value }) => onUpdate('student', value)}
      options={[
        { key: 'allStudents', value: '', text: 'Tous les élèves' },
        ...students.map(student => ({ key: student, value: student, text: student })),
      ]}
      size="tiny"
    />
    <Select
      placeholder="Domaine de compétence"
      value={filters.skillDomain}
      onChange={(e, { value }) => onUpdate('skillDomain', value)}
      options={[
        { key: 'allDomains', value: '', text: 'Tous domaines' },
        ...skillDomains.map(skillDomain => ({
          key: skillDomain,
          value: skillDomain,
          text: skillDomain,
        })),
      ]}
      size="tiny"
    />
    <Button type="button" content="Réinitialiser les filtres" onClick={onClear} size="tiny" />
  </Segment>
);

Filters.propTypes = {
  filters: PropTypes.shape({
    student: PropTypes.string.isRequired,
    skillDomain: PropTypes.string.isRequired,
  }).isRequired,
  skillDomains: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  students: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default Filters;
