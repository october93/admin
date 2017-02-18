import React, { Component } from 'react';

import './style.scss';

export default class NotFoundPage extends Component {
  render() {
    return (
      <div className="NotFoundPage">
        <h1>
          404 <small>Not Found :(</small>
        </h1>
      </div>
    );
  }
}