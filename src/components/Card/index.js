import React, { Component } from 'react'
import { Highlight } from 'react-instantsearch/dom'
import glamorous from 'glamorous'
import './index.css'

const Key = glamorous.span({
  fontWeight: 'bold',
})

class Card extends Component {

  render() {
    const card = this.props.hit
    return (
      <div style={{ marginTop: '10px' }}>
        <div className="hit-id">
          <Key>ID: </Key><Highlight attribute="cardID" hit={card}/>
        </div>
        <div className="hit-author">
          <Key>Author: </Key><Highlight attribute="author.displayname" hit={card}/>
        </div>
        <span className="hit-body">
          <Highlight attribute="body" hit={card}/>
        </span>
      </div>
    )
  }
}

export default Card
