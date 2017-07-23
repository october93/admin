import React, { Component } from 'react'
import { observer, inject  } from 'mobx-react';
import { Card } from '@october/web-card'
import ReactTable from 'react-table'
import { Link, Sizes } from 'react-foundation';


import './style.scss';

const sortFn = (a, b) => {
  if (a.metric < b.metric) {
    return -1
  } else if (a.metric < b.metric) {
    return 1
  }
  return 0
}

const columns = [{
  Header: 'Card ID',
  accessor: 'cardID',
  filterable: true,
},
{
  Header: 'Likes',
  accessor: 'total_likes',
},
{
  id: "hitRate",
  Header: 'Hit Rate',
  accessor: d => d.total_reacts > 0 ? d.total_likes / d.total_reacts : 0,
  Cell: row => (Math.floor(row.value * 100) + "%")
}, {
  Header: "",
  accessor: "callback",
  Cell: row => (<Link onClick={row.value} size={Sizes.SMALL}>View</Link>)

}]

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

    const cardsData = this.props.store.allCardsWithMetrics.toJS().map((value, idx) => {
      value.callback = () => {
        this.props.store.getCardData(value.cardID)
      }
      return value
    })

    return (
      <div>
        <div className="card">
          {card}
        </div>
        <ReactTable
         data={cardsData}
         columns={columns}
         defaultPageSize={20}
        />
      </div>
    )
  }
}
