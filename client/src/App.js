import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import { concat, isEmpty } from 'ramda'; 

import DataSheet from './DataSheet';

/*
  baseline: initial objective assessment (>= 1/3 NO -> failed, OR x%)
  each session: cold probe OR %age on at least ~10 tries, comments/observations
  acquired when...: e.g. YES 3 consecutive sessions, ~90% for ~3 consec. sessions
  when acquired, ~1 week break, then retention probe (reminder?)
  retention probe failed -> suggest higher criterium?

  weekly cumulative graph for retention (add week's total and add new point), w/ condition change lines??

  ========================
  TODO:
  ========================
  automatic archival
  toggle isArchived
  set up github
  set up local test db
  save in db
  local storage?
  sign up
  log in
  set up db (aws? elephantsql?)
  probe proper date input, not string
  allow pdf export/print display?
  fix rest api
  sort by last updated/last created?
  suggestion after criterium met (retention after daily streak, daily after failed retention)
  comments -> notes
  ability to add notes to existing probe, and to other therapists' probes as questions?
  publish app online
  accounts (security), autho0? (https://auth0.com/authenticate/react/google/)
  tables horizontal scrolling
  allow other therapists edition
  share with parents
  plug in search
  https

  table recap target (debut, fin quand termine, "baseline"?), skills tracking sheet
  -> graphe cumulatif (nb cibles retenues dans la semaine)
  demandes PECS
*/

const HeaderView = styled.div`
  background-color: #282c34;
  min-height: 16vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  padding-bottom: 10px;
`;

const MainView = styled.div`
  text-align: center;
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

const LinkView2 = styled(Link)`
  color: white;
  text-decoration: none;
`;

const NewSheetBlockView = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
`;
const NewSheetBlock = ({ sheetDraft: { student, skillDomain }, onFieldUpdate, children }) => (
  <NewSheetBlockView>
    <div>Elève <input value={student} onChange={({ target: { value } }) => onFieldUpdate('student', value)} /></div>
    <div>Domaine <input value={skillDomain} onChange={({ target: { value } }) => onFieldUpdate('skillDomain', value)} /></div>
    {children}
  </NewSheetBlockView>
);

class Index extends Component {
  state = {
    sheets: [],
    sheetDraft: {},
    isAddingSheet: false,
  };

  async componentDidMount() {
    try {
      const sheets = await this.fetchSheets();
      this.setState({ sheets });
    } catch (err) {
      console.log(err);
    }
  }

  fetchSheets = async () => {
    const userId = 1;
    const response = await fetch(`/api/sheets/${userId}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  onConfirmAddNewSheet = async () => {
    const { sheetDraft } = this.state;

    const response = await fetch(`/api/sheets/1`, { //userId
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sheet: sheetDraft,
      }),
    });

    const newSheet = await response.json();
    this.setState({
      sheets: concat(this.state.sheets, [newSheet]),
      isAddingSheet: false,
    });
  };

  render() {
    const { sheets, sheetDraft, isAddingSheet } = this.state;
    
    return (
      <div style={{ display: 'flex', flex: '1 0 auto', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: '10px' }}>
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
            <NewSheetBlock sheetDraft={sheetDraft} onFieldUpdate={(fieldName, value) => this.setState({ sheetDraft: { ...sheetDraft, [fieldName]: value } })}>
              <div>
                <button disabled={isEmpty(sheetDraft.student)} onClick={this.onConfirmAddNewSheet}>
                  Confirmer
                </button>
                <button onClick={() => this.setState({ isAddingSheet: false })}>
                  Annuler
                </button>
              </div>
            </NewSheetBlock>
          ) : (
            <button onClick={() => this.setState({ isAddingSheet: true, sheetDraft: { student: '', skillDomain: '', } })}>
              Nouvelle feuille
            </button>
          )}
        </SheetView>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <MainView>
            <HeaderView>
              <nav>
                <LinkView2 to="/">Home</LinkView2>
              </nav>
              <h2>Feuille de cotation quotidienne</h2>
              {/* <h2>Daily probe data sheet</h2> */}
              <div style={{ fontSize: '1rem' }}>
                <div>Elève : J.D.</div>
                <div>Domaine de compétence : language réceptif</div>
              </div>
            </HeaderView>
            <div style={{ display: 'flex', flex: '1 0 auto', justifyContent: 'space-evenly', border: '1px solid'}}>
              Filters:
              <div>
                <label>Elève</label>
                <select>
                  <option value="1">Elève 1</option>
                  <option value="2">Elève 2</option>
                  <option value="3">Elève 3</option>
                </select>
              </div>
              <div>
                <label>Domaine de competence</label>
                <select>
                  <option value="1">Domaine 1</option>
                  <option value="2">Domaine 2</option>
                  <option value="3">Domaine 3</option>
                </select>
              </div>
            </div>
    
            <Route path="/" exact component={Index} />
            <Route path="/datasheet/:sheetId" component={DataSheet} />
          </MainView>
        </Router>
      </div>
    );
  }
}

export default App;
