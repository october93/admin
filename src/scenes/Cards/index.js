import React, { Component } from 'react'
import CardLink from '../../components/CardLink'
import { connect } from 'react-redux'
import { getCards, cardsSortBy } from '../../actions/cards'
import './index.css'

class Cards extends Component {
  constructor(props) {
    super(props)
    let endpoint = `${location.origin}/graphql`
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      endpoint = 'http://localhost:9000/graphql'
    }
    this.handleSort = this.handleSort.bind(this)
    this.props.getCards(endpoint)
  }

  handleSort(event) {
    this.props.dispatch(cardsSortBy(event.target.value))
  }

  sortedCards() {
    let cards = Object.values(this.props.cards)
    switch (this.props.sortBy) {
      case 'boosts':
        cards = cards.sort((a, b) => b.stats.boosts - a.stats.boosts)
        break
      case 'buries':
        cards = cards.sort((a, b) => b.stats.buries - a.stats.buries)
        break
      case 'hifives':
        cards = cards.sort((a, b) => b.stats.hifives - a.stats.hifives)
        break
      case 'views':
        cards = cards.sort((a, b) => b.stats.views - a.stats.views)
        break
      default:
    }
    return cards
  }

  render() {
    if (this.props.isLoading) {
      return "Loading…"
    }

    const Cards = (
      this.sortedCards().map((card, i) => (
        <tr key={i}>
          <td><CardLink cardID={card.card.cardID} cards={this.props.cards} /></td>
          <td>{card.author.displayname}</td>
          <td>{card.stats.boosts}</td>
          <td>{card.stats.buries}</td>
          <td>{card.stats.hifives}</td>
          <td>{card.stats.views}</td>
        </tr>
      ))
    )

    return (
      <div className="Cards">
        <label htmlFor="sortBy">Sort by:</label>
        <select onChange={this.handleSort} value={this.props.sortBy} name="sortBy">
          <option value="boost">Boosts</option>
          <option value="buries">Buries</option>
          <option value="hifives">Hifives</option>
          <option value="views">Views</option>
        </select>
        <table className="Cards-table">
          <thead>
            <tr>
              <th>Card ID</th>
              <th>Author</th>
              <th>Boosts</th>
              <th>Buries</th>
              <th>Hifives</th>
              <th>Views</th>
            </tr>
          </thead>
          <tbody>
            {Cards}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cards: state.cardsCardsLoadingSuccess,
    error: state.cardsCardsLoadingFailure,
    isLoading: state.cardsCardsAreLoading,
    sortBy: state.cardsSortedBy,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCards: (url) => dispatch(getCards(url)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards)
