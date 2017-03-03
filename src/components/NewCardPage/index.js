import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { FaSpinner }  from 'react-icons/lib/fa';
import { Callout, Colors, Sizes } from "react-foundation"

import './style.scss';

@inject("store") @observer
export default class NewCardPage extends Component {
  constructor(props){
    super(props)

    this.state = {
      userid: "",
      body: "",
      url: "",
      anon: false,
      layoutdata: "",
    }

    this.inputChange = this.inputChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  inputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  submit(event) {
    event.preventDefault()

    let ld = {}
    let layoutTokens = this.state.layoutdata.split("|")
    for (let i = 0; i < layoutTokens.length; i++) {
      const dat = layoutTokens[i].split(":")
      ld[dat[0]] = dat[1]
    }

    this.props.store.newCardRequest(this.state.userid, this.state.body, this.state.url, this.state.anon, ld)
  }

  render() {
    const { className, ...props } = this.props;

    const store = this.props.store

    let shownAlert = null

    //the === true check is because newusersuccess can be null in which case we should show nothing
    if(store.newCardStatus === "waiting") {
      shownAlert = (<FaSpinner />)
    } else if (store.newCardStatus === "success") {
      shownAlert = (
        <Callout color={Colors.SUCCESS} size={Sizes.SMALL}>
          <h5>Success!</h5>
        </Callout>
      )
    } else if (store.newCardStatus === "failure") {
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
  				<input type="checkbox" id="anonymous" checked={this.anon} name="anon" onChange={this.inputChange}/><label>Anonymous</label>
  				<label>Posting User ID</label>
  				<input type="text" placeholder="ID" name="userid" onChange={this.inputChange} required/>
  				<label>Post Body</label>
  				<textarea type="text" placeholder="Body" name="body" onChange={this.inputChange}></textarea>
  				<label>URL</label>
  				<input type="text" placeholder="URL"  name="url" onChange={this.inputChange}/>
  				<label>Layout Data</label>
  				<input type="text" placeholder="Layout Data" name="layoutdata" onChange={this.inputChange}/>
          <Callout>
              <div className="preformattedWhitespace">
                {`Format: key:value|key:value|...
                Options:
                fullScreen:true - renders card full screen (breaks on non-image cards)
                bgIndex:[idx] - chooses background color for card (only for cards with links w/ no diffbot img, idx 0-5 are colors, 6-10 are images)`}
             </div>
          </Callout>
  				<button type="submit" className="button">Submit</button>
  			</form>
      </div>
    );
  }
}
