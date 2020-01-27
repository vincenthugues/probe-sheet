import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Card, Container, Divider, Grid, Header,
} from 'semantic-ui-react';

import { getSheetsHandler, createSheetHandler } from '../actions';
import { getFilteredSheetIds } from './utils';
import Filters from './Filters';
import NewSheet from './NewSheet';

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

  onCreateSheet = async (sheetDraft) => {
    const { createSheet } = this.props;

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
      <Container>
        <Filters
          filters={filters}
          students={students}
          skillDomains={skillDomains}
          onUpdate={this.updateFilters}
          onClear={this.clearFilters}
        />

        <Header as="h3" content="Owned" />
        <Grid columns={3} stackable>
          {ownedSheetIds.map((sheetId) => {
            const { student, skillDomain } = sheets.find(({ id }) => id === sheetId);

            return (
              <Grid.Column key={sheetId}>
                <Link to={`/datasheet/${sheetId}`}>
                  <Card header={student} description={skillDomain} />
                </Link>
              </Grid.Column>
            );
          })}
          <Grid.Column>
            <NewSheet onCreateSheet={this.onCreateSheet} />
          </Grid.Column>
        </Grid>

        {sharedSheetIds.length ? (
          <Fragment>
            <Divider />
            <Header as="h3" content="Shared with me" />
            <Grid columns={3} stackable>
              {sharedSheetIds.map((sheetId) => {
                const { student, skillDomain } = sheets.find(({ id }) => id === sheetId);

                return (
                  <Grid.Column key={sheetId}>
                    <Link to={`/datasheet/${sheetId}`}>
                      <Card header={student} description={skillDomain} />
                    </Link>
                  </Grid.Column>
                );
              })}
            </Grid>
          </Fragment>
        ) : null}
      </Container>
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
