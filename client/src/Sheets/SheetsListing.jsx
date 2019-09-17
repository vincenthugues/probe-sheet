import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from 'ramda';
import styled from 'styled-components';

import { fetchSheets, createSheet } from '../apiHandler';

const FiltersView = styled.div`
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  margin: 0.2em;
`;

const SheetView = styled.div`
  justify-items: space-between;
  width: 140px;
  height: 180px;
  border: 1px solid;
  margin: 18px;
`;

const LinkView = styled(Link)`
  color: black;
  text-decoration: none;
`;

const NewSheetBlockView = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
`;

const NewSheetBlock = ({ sheetDraft: { student, skillDomain }, onFieldUpdate, children }) => (
  <NewSheetBlockView>
    <label htmlFor="student">
      Elève
      <input id="student" value={student} onChange={({ target: { value } }) => onFieldUpdate('student', value)} />
    </label>
    <label htmlFor="skillDomain">
      Domaine
      <input id="skillDomain" value={skillDomain} onChange={({ target: { value } }) => onFieldUpdate('skillDomain', value)} />
    </label>
    {children}
  </NewSheetBlockView>
);
NewSheetBlock.propTypes = {
  sheetDraft: PropTypes.shape({
    student: PropTypes.string,
    skillDomain: PropTypes.string,
  }).isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default class SheetsListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sheets: [],
      students: [],
      skillDomains: [],
      filters: {
        student: '',
        skillDomain: '',
      },
      filteredSheetIds: [],
      sheetDraft: {},
      isAddingSheet: false,
    };
  }

  componentDidMount = async () => {
    const { history } = this.props;
    if (!localStorage.getItem('token')) history.push('/login');

    const sheets = await fetchSheets();
    const { students, skillDomains } = sheets.reduce((acc, { student, skillDomain }) => ({
      students: [
        ...acc.students,
        ...acc.students.includes(student) ? [] : [student],
      ],
      skillDomains: [
        ...acc.skillDomains,
        ...acc.skillDomains.includes(skillDomain) ? [] : [skillDomain],
      ],
    }), {
      students: [],
      skillDomains: [],
    });
    const filteredSheetIds = this.getFilteredSheetIds(sheets);

    this.setState({
      sheets,
      students,
      skillDomains,
      filteredSheetIds,
    });
  }

  getFilteredSheetIds = (sheets, filters = {}) => sheets
    .filter(({ student }) => !filters.student || student === filters.student)
    .filter(({ skillDomain }) => !filters.skillDomain || skillDomain === filters.skillDomain)
    .map(({ id }) => id);

  updateFilters = (filter, value) => {
    const { filters, sheets } = this.state;
    const newFilters = {
      ...filters,
      [filter]: value,
    };

    this.setState({
      filters: newFilters,
      filteredSheetIds: this.getFilteredSheetIds(sheets, newFilters),
    });
  };

  clearFilters = () => {
    const filters = {
      student: '',
      skillDomain: '',
    };

    this.setState(({ sheets }) => ({
      filters,
      filteredSheetIds: this.getFilteredSheetIds(sheets, filters),
    }));
  };

  onConfirmAddNewSheet = async () => {
    const { sheetDraft, sheets } = this.state;

    const newSheet = await createSheet(sheetDraft);

    this.setState({
      sheets: [...sheets, newSheet],
      sheetDraft: {},
      isAddingSheet: false,
    });
  }

  render() {
    const {
      sheets,
      students,
      skillDomains,
      filters,
      filteredSheetIds,
      sheetDraft,
      isAddingSheet,
    } = this.state;

    return (
      <Fragment>
        <FiltersView>
          Filtres:
          <select value={filters.student} onChange={({ target: { value } }) => this.updateFilters('student', value)}>
            <option value="">--- Tous les élèves ---</option>
            {students.map(student => (
              <option key={student} value={student}>{student}</option>
            ))}
          </select>
          <select value={filters.skillDomain} onChange={({ target: { value } }) => this.updateFilters('skillDomain', value)}>
            <option value="">--- Tous domaines de compétence ---</option>
            {skillDomains.map(skillDomain => (
              <option key={skillDomain} value={skillDomain}>{skillDomain}</option>
            ))}
          </select>
          <button type="button" onClick={this.clearFilters}>
            Réinitialiser les filtres
          </button>
        </FiltersView>

        <div style={{
          display: 'flex',
          flex: '1 0 auto',
          flexFlow: 'row wrap',
          justifyContent: 'space-around',
          padding: '10px',
        }}
        >
          {filteredSheetIds.map((sheetId) => {
            const { student, skillDomain } = sheets.find(({ id }) => id === sheetId);

            return (
              <LinkView key={sheetId} to={`/datasheet/${sheetId}`}>
                <SheetView>
                  <div>{student}</div>
                  <div>{skillDomain}</div>
                </SheetView>
              </LinkView>
            );
          })}
          <SheetView>
            {isAddingSheet ? (
              <NewSheetBlock
                sheetDraft={sheetDraft}
                onFieldUpdate={(fieldName, value) => this.setState({
                  sheetDraft: { ...sheetDraft, [fieldName]: value },
                })}
              >
                <div>
                  <button type="button" disabled={isEmpty(sheetDraft.student)} onClick={this.onConfirmAddNewSheet}>
                    Confirmer
                  </button>
                  <button type="button" onClick={() => this.setState({ isAddingSheet: false })}>
                    Annuler
                  </button>
                </div>
              </NewSheetBlock>
            ) : (
              <button type="button" onClick={() => this.setState({ isAddingSheet: true, sheetDraft: { student: '', skillDomain: '' } })}>
                Nouvelle feuille
              </button>
            )}
          </SheetView>
        </div>
      </Fragment>
    );
  }
}
SheetsListing.propTypes = {
  history: PropTypes.shape().isRequired,
};
