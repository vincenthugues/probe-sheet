import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { isEmpty } from 'ramda';
import styled from 'styled-components';

import { getSheetsHandler, createSheetHandler } from '../actions';
import { getFilteredSheetIds } from './utils';
import Filters from './Filters';
import NewSheetBlock from './NewSheetBlock';

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

const SheetsGroupView = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-flow: row wrap;
  justify-content: space-around;
  padding: 10px;
`;

class SheetsListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { isAuthenticated, isValidated, getSheets } = this.props;

    if (isAuthenticated && isValidated) {
      await getSheets();
      this.computeSheetsMetadata();
    }
  }

  computeSheetsMetadata = async () => {
    const { sheets } = this.props;
    const { filters } = this.state;

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

    this.setState({
      students,
      skillDomains,
      filteredSheetIds: getFilteredSheetIds(sheets, filters),
    });
  }

  updateFilters = (filter, value) => {
    const { sheets } = this.props;
    const { filters } = this.state;
    const newFilters = {
      ...filters,
      [filter]: value,
    };

    this.setState({
      filters: newFilters,
      filteredSheetIds: getFilteredSheetIds(sheets, newFilters),
    });
  };

  clearFilters = () => {
    const { sheets } = this.props;
    const filters = {
      student: '',
      skillDomain: '',
    };

    this.setState({
      filters,
      filteredSheetIds: getFilteredSheetIds(sheets, filters),
    });
  };

  onConfirmAddNewSheet = async () => {
    const { createSheet } = this.props;
    const { sheetDraft } = this.state;

    this.setState({
      sheetDraft: {},
      isAddingSheet: false,
    });

    await createSheet(sheetDraft);
    this.computeSheetsMetadata();
  }

  render() {
    const {
      isAuthenticated, isValidated, userId, sheets,
    } = this.props;
    const {
      students,
      skillDomains,
      filters,
      filteredSheetIds,
      sheetDraft,
      isAddingSheet,
    } = this.state;

    if (!isAuthenticated) return <Redirect to="/login" />;
    if (!isValidated) return <Redirect to="/pending-validation" />;

    const ownedSheetIds = filteredSheetIds.filter((id) => {
      const matchedSheet = sheets.find(sheet => sheet.id === id);
      return matchedSheet.ownerId === userId;
    });
    const sharedSheetIds = filteredSheetIds.filter(id => (
      (sheets.find(sheet => sheet.id === id)).ownerId !== userId
    ));

    return (
      <Fragment>
        <Filters
          filters={filters}
          students={students}
          skillDomains={skillDomains}
          onUpdate={this.updateFilters}
          onClear={this.clearFilters}
        />

        <h3>Owned</h3>
        <SheetsGroupView>
          {ownedSheetIds.map((sheetId) => {
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
        </SheetsGroupView>
        <h3>Shared with me</h3>
        <SheetsGroupView>
          {sharedSheetIds.map((sheetId) => {
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
        </SheetsGroupView>
      </Fragment>
    );
  }
}
SheetsListing.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isValidated: PropTypes.bool.isRequired,
  userId: PropTypes.number,
  sheets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getSheets: PropTypes.func.isRequired,
  createSheet: PropTypes.func.isRequired,
};
SheetsListing.defaultProps = {
  userId: null,
};

const mapStateToProps = ({
  auth: { isAuthenticated, user },
  probeSheets: { sheets },
}) => ({
  isAuthenticated,
  isValidated: !!(user && user.isValidated),
  userId: user ? user.id : null,
  sheets,
});

const mapDispatchToProps = dispatch => ({
  getSheets: getSheetsHandler(dispatch),
  createSheet: createSheetHandler(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SheetsListing);
