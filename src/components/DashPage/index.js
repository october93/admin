import React, { Component } from 'react';
import classnames from 'classnames';

import './style.scss';

class DashPage extends Component {
  render() {
    const { className, ...props } = this.props;
    return (
        <div class={classnames("DashPage", className)}>
        This is the October Dashboard. We display important things here.
        </div>
    );
  }
}

export default DashPage;
