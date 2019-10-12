import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FiltersView = styled.div`
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  margin: 0.2em;
`;

const Filters = ({
  filters, students, skillDomains, onUpdate, onClear,
}) => (
  <FiltersView>
    Filtres:
    <select value={filters.student} onChange={({ target: { value } }) => onUpdate('student', value)}>
      <option value="">--- Tous les élèves ---</option>
      {students.map(student => (
        <option key={student} value={student}>{student}</option>
      ))}
    </select>
    <select value={filters.skillDomain} onChange={({ target: { value } }) => onUpdate('skillDomain', value)}>
      <option value="">--- Tous domaines de compétence ---</option>
      {skillDomains.map(skillDomain => (
        <option key={skillDomain} value={skillDomain}>{skillDomain}</option>
      ))}
    </select>
    <button type="button" onClick={onClear}>
      Réinitialiser les filtres
    </button>
  </FiltersView>
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
