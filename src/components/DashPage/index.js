import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from "react-foundation"

import './style.scss';

@inject("store") @observer
class DashPage extends Component {
  constructor(props){
    super(props)

    this.connectToProd = this.connectToProd.bind(this)
    this.connectToLocal = this.connectToLocal.bind(this)
  }

  connectToProd(){
    this.props.store.changeEndpoint("wss://testing.october.news")
  }

  connectToLocal(){
    this.props.store.changeEndpoint("ws://localhost:8080")
  }

  render() {
    return (
        <div>
        This is the October Dashboard. We display important things here.
        <div>
          <Button onClick={this.connectToProd}>Connect To testing.october.news</Button>
          <div>
            <Button onClick={this.connectToLocal}>Connect To local</Button>

          </div>
        </div>
        </div>

    );
  }
}

export default DashPage;
