import React, { Component } from 'react'
import { Highlight } from 'react-instantsearch/dom'
import glamorous from 'glamorous'

const Key = glamorous.span({
  fontWeight: 'bold',
})

const StyledHighlight = glamorous(Highlight)({
  "& .ais-Highlight-highlighted": {
    backgroundColor: "#fdfd96",
  }
})

class Card extends Component {

  render() {
    const card = this.props.hit
    return (
      <div style={{ marginTop: '10px' }}>
        <div className="hit-id">
          <Key>ID: </Key><StyledHighlight attribute="cardID" hit={card}/>
        </div>
        <div className="hit-author">
          <Key>Author: </Key><StyledHighlight attribute="author.displayname" hit={card}/>
        </div>
        <span className="hit-body">
          <StyledHighlight attribute="body" hit={card}/>
        </span>
      </div>
    )
  }
}

export default Card
