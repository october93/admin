import React, { Component } from 'react'
import { observer, inject  } from 'mobx-react';
import { Card } from '@october/web-card'
import ReactTable from 'react-table'
import { Link, Sizes } from 'react-foundation';
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis} from 'recharts'
import { Column, Row  } from 'react-foundation'

import './style.scss';

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
  id: 'feedback',
  Header: 'Feedback',
  accessor: d => d.feedback.length,
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
    let feedbackTable = null

    if (this.props.store.cardPreview && this.props.store.cardPreview.layoutdata !== null ) {
      card = (
        <Card data={JSON.parse(this.props.store.cardPreview.layoutdata)}/>
      )
    }

    if (this.props.store.cardPreview && this.props.store.cardPreview.feedback && this.props.store.cardPreview.feedback.length > 0){
      const feedbackRows = this.props.store.cardPreview.feedback.map((data) => (
        <tr>
          <td>{data.rating}</td>
          <td>{data.comment}</td>
        </tr>
      ))

      feedbackTable = (
        <table className="hover">
          <thead>
            <tr>
              <th>Rating</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {feedbackRows}
          </tbody>
        </table>
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

        <Row className="display">
          <Column small={12} large={6}>
            <div className="card">
              {card}
            </div>
          </Column>
          <Column small={12} large={6}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={this.props.store.cardHitRateMetricsData.toJS()}
                margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                <XAxis domain={[0, 100]} dataKey="hitRate" name="HitRate" />
                <YAxis  dataKey="number" />
                <Tooltip />
                <Line type='monotone' dataKey="number" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Column>
        </Row>
        {feedbackTable}
        <ReactTable
         data={cardsData}
         columns={columns}
         defaultPageSize={20}
        />
      </div>
    )
  }
}
