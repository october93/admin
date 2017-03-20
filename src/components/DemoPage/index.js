import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {FaSpinner}  from 'react-icons/lib/fa';
import { Callout, Colors, Sizes} from 'react-foundation';


@inject("store") @observer
export default class DemoPage extends Component {
  constructor(props){
    super(props)

    this.changeText = this.changeText.bind(this)
    this.submit = this.submit.bind(this)
  }

  changeText(event){
    this.props.store.demoData = event.target.value
  }

  submit(event){
    event.preventDefault()

    this.props.store.setDemoRequest(this.props.store.demoData)
  }

  render() {
    const store = this.props.store
    let shownAlert = null

    if(store.setDemoStatus === "waiting") {
      shownAlert = (<FaSpinner />)
    } else if (store.setDemoStatus === "success") {
      shownAlert = (
        <Callout color={Colors.SUCCESS} size={Sizes.SMALL}>
          <h5>Success!</h5>
        </Callout>
      )
    } else if (store.setDemoStatus === "failure") {
      shownAlert = (
        <Callout color={Colors.ALERT} size={Sizes.SMALL}>
          <h5>Failed.</h5>
        </Callout>
      )
    }

    return (
      <div>
        {shownAlert}
        <form onSubmit={this.submit}>
          <textarea value={this.props.store.demoData} onChange={this.changeText}></textarea>
          <button type="submit" className="button">Update</button>
        </form>
      </div>
    );
  }
}
