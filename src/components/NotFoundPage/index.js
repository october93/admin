import React, { Component } from 'react';
import classnames from 'classnames';

import './style.scss';

export default class NotFoundPage extends Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames("NotFoundPage", className)}>
        <h1>
          404 <small>Not Found :(</small>
        </h1>
      </div>
    );
  }
}
