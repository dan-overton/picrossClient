import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Loading.css';

class Loading extends Component {

  render() {
    return (
      <div className="Loading">
        <p>Loading...</p>
      </div>
    );
  }
}

export default Loading;
