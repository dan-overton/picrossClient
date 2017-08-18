import React, { Component } from 'react';

import { Link, Route } from 'react-router-dom';

import GamesList from './GamesList';
import { connect } from 'react-redux'; 
import Game from './Game';
import logo from './logo.svg';
import './App.css';

import { CALL_API} from './middleware/api'; 
import { getGames, setTitle } from './actions';

class App extends Component {
  constructor(props) {
    super(props);

    this.props.getGames();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Link to="/">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>{this.props.title}</h2>
          </Link>
        </div>
        <div className="App-intro">
            <Route exact path="/" render={(props) => <GamesList {...props} setTitle={this.props.setTitle} games={this.props.games} />}/>
            <Route path="/games/:id" render={(props) => <Game {...props} setTitle={this.props.setTitle} games={this.props.games}/>}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) { 
  return {
      games: state.games,
      title: state.header.title
    }; 
}

function mapDispatchToProps(dispatch) {
  return({
      getGames: () => {dispatch(getGames())},
      setTitle: (title) => {dispatch(setTitle(title))}
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
