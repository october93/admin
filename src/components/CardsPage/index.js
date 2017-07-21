import React, { Component } from 'react'
import { observer, inject, toJS } from 'mobx-react';
import { Card } from '@october/web-card'


import './style.scss';

const card = {"content":{"content":{"bgColor":["#fff"],"bgOpacity":0,"content":[{"fontColor":"#fff","fontSize":24,"justification":"center","text":"How Technology is Changing What it Means to Be Human","type":"textBody"},{"fontColor":"#fff","fontSize":12,"justification":"center","text":"www.scout.ai","type":"linkDomain"}],"type":"container"},"resizeMode":"cover","src":"https://scout-cdn.s3.amazonaws.com/BJOGhmErZundefined","type":"image"},"rootType":"overlay","url":"https://www.scout.ai/story/how-technology-is-changing-what-it-means-to-be-human"}

@inject("store") @observer
export default class CardsPage extends Component {
  state = {
    cardid: "",
  }

  submit = (event) => {
    event.preventDefault()
    this.props.store.getCardData(this.state.cardid)
  }

  inputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  render() {
    let card = null

    if (this.props.store.layoutDataCardPreview !== null ) {
      card = (
        <Card data={JSON.parse(this.props.store.layoutDataCardPreview)}/>
      )
    }
    return (
      <div>
        <form onSubmit={this.submit}>
          <label>CardID</label>
          <input type="text" value={this.state.cardid} placeholder="Name/ID" name="cardid" onChange={this.inputChange} required/>
          <button type="submit" className="button">Submit</button>
        </form>
        <div className="card">
          {card}
        </div>
      </div>
    )
  }
}
