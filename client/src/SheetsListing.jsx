import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from 'ramda';
import styled from 'styled-components';

import { fetchSheets, createSheet } from './apiHandler';

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
      sheetDraft: {},
      isAddingSheet: false,
    };
  }

  componentDidMount = async () => {
    const sheets = await fetchSheets();
    this.setState({ sheets });
  }

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
    const { sheets, sheetDraft, isAddingSheet } = this.state;

    return (
      <Fragment>
        <FiltersView>
        Filters:
          <select>
            <option value={null}>---- Elève ----</option>
            <option value={1}>Elève 1</option>
            <option value={2}>Elève 2</option>
            <option value={3}>Elève 3</option>
          </select>
          <select>
            <option value={null}>--- Domaine de compétence ---</option>
            <option value="1">Domaine 1</option>
            <option value="2">Domaine 2</option>
            <option value="3">Domaine 3</option>
          </select>
        </FiltersView>

        <div style={{
          display: 'flex',
          flex: '1 0 auto',
          flexFlow: 'row wrap',
          justifyContent: 'space-around',
          padding: '10px',
        }}
        >
          {sheets.map(({ id, student, skillDomain }) => (
            <LinkView key={id} to={`/datasheet/${id}`}>
              <SheetView>
                <div>{student}</div>
                <div>{skillDomain}</div>
              </SheetView>
            </LinkView>
          ))}
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
