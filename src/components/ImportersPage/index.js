import React, { Component } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { FaSpinner }  from 'react-icons/lib/fa';
import { Link } from 'react-router'

import { Button, Colors, Sizes, Label } from 'react-foundation';


@inject("store") @observer
export default class ImportersPage extends Component {
  render() {
    const { className, ...props } = this.props;

    let statusIndicator = (<Label color={Colors.SECONDARY}>Querying...</Label>)

    if(this.props.store.hnStatus === "up"){
      statusIndicator = (<Label color={Colors.SUCCESS}>Running</Label>)
    } else if (this.props.store.hnStatus === "down"){
      statusIndicator = (<Label color={Colors.ALERT}>Down</Label>)
    }

    return (
      <div className={classnames("UsersPage", className)}>
        <div>
          HN Importer: {statusIndicator}
        </div>
        <div>
          <Button color={Colors.SUCCESS} onClick={() => this.props.store.changeHNStatusRequest("up")}>Start</Button>
          <Button color={Colors.ALERT} onClick={() => this.props.store.changeHNStatusRequest("down")}>Stop</Button>
        </div>
      </div>
    )
  }
}
