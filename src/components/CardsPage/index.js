import React, { Component } from 'react'
import { observer, inject  } from 'mobx-react';
import { Card } from '@october/web-card'
import ReactTable from 'react-table'
import { Link, Sizes } from 'react-foundation';
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis} from 'recharts'
import { Column, Row  } from 'react-foundation'
import dateFormat from 'dateformat'

import './style.scss';

const columns = [{
  Header: 'Card ID',
  accessor: 'cardID',
  filterable: true,
},
{
  id: 'postedon',
  Header: 'Posted On',
  accessor: d => dateFormat(new Date(d.post_timestamp*1000), "mm/dd H:M:s")

},
{
  Header: 'Likes',
  accessor: 'total_likes',
},
{
  id: 'feedback',
  Header: 'Feedback',
  accessor: d => d.feedback == null ? 0 : d.feedback.length,
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
    from: this.props.store.dashboardFromTime,
    to: this.props.store.dashboardToTime,
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

  onBlur = () => {
    this.props.store.getCardsData(this.state.from, this.state.to)
  }

  render() {
    let card = null
    let feedbackTable = null

    if (this.props.store.cardPreviewLayoutdata !== null ) {
      card = (
        <Card data={JSON.parse(this.props.store.cardPreviewLayoutdata)}/>
      )
    }

    if (this.props.store.cardPreviewFeedback && this.props.store.cardPreviewFeedback.length > 0){
      console.log(`${this.props.store.cardPreviewFeedback && this.props.store.cardPreviewFeedback.length > 0} --- ${this.props.store.cardPreviewFeedback.length}`);
      const feedbackRows = this.props.store.cardPreviewFeedback.toJS().map((data) => (
        <tr>
          <td>{data.rating}</td>
          <td>{data.comment}</td>
        </tr>
      ))

      feedbackTable = (
        <table className="hover">
          <thead>
            <tr>
              <th span={2}>Feedback</th>
            </tr>
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
        <h3>From <input onBlur={this.onBlur} style={{width: "120px", display: "inline"}} type="text" value={this.state.from} name="from" onChange={this.inputChange} required/> to <input onBlur={this.onBlur} style={{width: "120px", display: "inline"}} className="picker" type="text" value={this.state.to} name="to" placeholder="To" onChange={this.inputChange} required/></h3>

        <Row className="display">
          <Column small={12} large={6}>
            <div className="card">
              {card}
            </div>
          </Column>
          <Column small={12} large={6}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={this.props.store.cardHitRateMetricsData.toJS()}
                margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                <XAxis domain={[0, 100]} dataKey="hitRate" name="HitRate" />
                <YAxis  dataKey="number" />
                <Tooltip />
                <Bar type='monotone' dataKey="number" stroke="#8884d8" />
              </BarChart>
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
