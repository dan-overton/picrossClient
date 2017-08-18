import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'; 
import Loading from './Loading'
import './GamesList.css';

class GamesList extends Component {

  componentDidMount()
  {
    this.props.setTitle('Welcome to Picross!');
  }
  
  render() {

    if(this.props.games.loading) {
        return (
        <div className="GamesList">
            <Loading/>
        </div>);
    }
    else {
        if(this.props.games.errored) {
            return (<div className="GamesList"><p>Error: {this.props.games.errorMessage}</p></div>);
        }
        var games = this.props.games.items.map(g => {
            return <li key={g.id}><Link to={'/games/' + g.id}><div>{g.name}</div></Link></li>
        });
        return (
            <div className="GamesList">
                <ul>
                    {games}
                </ul>
            </div>
        );
    }
  }
}

export default GamesList;
