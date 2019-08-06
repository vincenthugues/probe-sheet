import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { concat, isEmpty } from 'ramda'; 
import styled from 'styled-components';

import { fetchUser, createUser, fetchSheets, createSheet } from './apiHandler';
import DataSheet from './DataSheet';

const USER_ID = 1;

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

const NavView = styled.nav`
  display: flex;
  flex: 1 0 auto;
  border: 1px dashed white;
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

const MenuLinkView = styled(Link)`
  color: white;
  margin: .4em;
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
    const sheets = await fetchSheets();
    this.setState({ sheets });
  }

  onConfirmAddNewSheet = async () => {
    const { sheetDraft } = this.state;
    
    const newSheet = await createSheet({
      ...sheetDraft,
      creationDate: Date.now(),
      lastUpdateDate: Date.now(),
      ownerId: 1, // TODO
    });

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

class LogIn extends Component {
  state = {
    email: null,
    password: null,
    isSignUpOpen: false,
  };

  onLoginConfirm = async () => {
    const user = await fetchUser(USER_ID);

    console.log('user', user);
  };

  onLoginCancel = async () => {
    this.setState({
      email: null,
      password: null,
      isSignUpOpen: false,
    });
  };

  onSignUpOpen = async () => {
    this.setState({
      password: null,
      isSignUpOpen: true,
    });
  };

  onSignUpConfirm = async () => {
    const { email, password } = this.state;
    const newUser = await createUser(email, password);

    console.log('newUser', newUser);
  };

  onSignUpCancel = async () => {
    this.setState({
      password: null,
      isSignUpOpen: false,
    });
  };

  render = () => {
    const { email, password, isSignUpOpen } = this.state;

    return (
      <div style={{
        border: 'dashed #B0B0B0 1px',
        display: 'flex',
        flex: '1 0 auto',
        flexDirection: 'column',
        justifyContent: 'space-around',
        maxWidth: '400px',
        margin: 'auto',
        padding: '.4em' }
      }>
        {isSignUpOpen ? (
          <form>
            <input label="Test" placeholder="email" value={email || ''} onChange={({ target: { value } }) => this.setState({ email: value })} />
            <input label="Test" placeholder="password" value={password || ''}  onChange={({ target: { value } }) => this.setState({ password: value })} />
            <div>
              <button disabled={isEmpty(email) || isEmpty(password)} onClick={this.onSignUpConfirm}>
                Confirmer
              </button>
              <button onClick={this.onSignUpCancel}>
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <Fragment>
            <input label="Test" placeholder="email" value={email || ''} onChange={({ target: { value } }) => this.setState({ email: value })} />
            <input label="Test" placeholder="password" value={password || ''}  onChange={({ target: { value } }) => this.setState({ password: value })} />
            <div>
              <button disabled={isEmpty(email) || isEmpty(password)} onClick={this.onLoginConfirm}>
                Confirmer
              </button>
              <Link to='/'>
                <button onClick={this.onLoginCancel}>
                  Annuler
                </button>
              </Link>
            </div>
            <div>
              <button onClick={this.onSignUpOpen}>
                Créer un compte
              </button>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
};

export default () => (
  <div className="App">
    <Router>
      <MainView>
        <HeaderView>
          <NavView>
            <MenuLinkView to="/">Home</MenuLinkView>
            <MenuLinkView to="/login">Login</MenuLinkView>
          </NavView>
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
              <option value={null}>--------</option>
              <option value={1}>Elève 1</option>
              <option value={2}>Elève 2</option>
              <option value={3}>Elève 3</option>
            </select>
          </div>
          <div>
            <label>Domaine de compétence</label>
            <select>
              <option value={null}>--------------</option>
              <option value="1">Domaine 1</option>
              <option value="2">Domaine 2</option>
              <option value="3">Domaine 3</option>
            </select>
          </div>
        </div>

        <Route path="/" exact component={Index} />
        <Route path="/login" exact component={LogIn} />
        <Route path="/datasheet/:sheetId" component={DataSheet} />
      </MainView>
    </Router>
  </div>
);
