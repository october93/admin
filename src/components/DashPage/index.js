import React, { Component } from 'react'
import { Link } from 'react-foundation'
import { observer, inject } from 'mobx-react'
import { Column, Row  } from 'react-foundation'
import dateFormat from 'dateformat'

import './style.scss'

const sortFn = (a, b) => {
  if (a.metric < b.metric) {
    return -1
  } else if (a.metric < b.metric) {
    return 1
  }
  return 0
}

@inject("store") @observer
class DashPage extends Component {
  constructor(props){
      super(props)

      const today = new Date()
      const lastSunday = new Date(today)
      lastSunday.setDate(today.getDate() - today.getDay())
      const nextSunday = new Date(today)
      nextSunday.setDate(today.getDate() + 7 - today.getDay())

      this.state = {
        from: dateFormat(lastSunday, "yyyy-mm-dd"),
        to: dateFormat(nextSunday, "yyyy-mm-dd"),
      }
  }

  onBlur = () => {
    this.props.store.getDashboardMetrics(this.state.from, this.state.to)
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
    const postsList = this.props.store.postRankings.toJS().map((data, i) =>
      <tr className={ i === 0 ? "firstRow" : ""}>
        <td>{data.name}</td>
        <td>{data.metric > 0 ? data.metric: "-"}</td>
      </tr>
    )

    const likesList = this.props.store.likeRankings.toJS().map((data, i) =>
      <tr className={ i === 0 ? "firstRow" : ""}>
        <td>{data.name}</td>
        <td>{data.metric > 0 ? data.metric: "-"}</td>
      </tr>
    )

    const hitList = this.props.store.hitRateRankings.toJS().map((data, i) =>
      <tr className={ i === 0 ? "firstRow" : ""}>
        <td>{data.name}</td>
        <td>{data.metric > 0 ? data.metric.toFixed(2)* 100 + "%" : "-"}</td>
      </tr>
    )



    return (
      <div>
        <div>
          <h3>From <input onBlur={this.onBlur} style={{width: "120px", display: "inline"}} type="text" value={this.state.from} name="from" onChange={this.inputChange} required/> to <input onBlur={this.onBlur} style={{width: "120px", display: "inline"}} className="picker" type="text" value={this.state.to} name="to" placeholder="To" onChange={this.inputChange} required/></h3>
          <Row className="display">
            <Column small={12} large={4}>
              <h2>
                Total Posts: {this.props.store.totalPosts}
              </h2>
              <table className="hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Posts</th>
                  </tr>
                </thead>
                <tbody>
                  {postsList}
                </tbody>
              </table>
            </Column>
            <Column small={12} large={4}>
              <h2>
                Total Likes: {this.props.store.totalLikes}
              </h2>
              <table className="hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {likesList}
                </tbody>
              </table>
            </Column>
            <Column small={12} large={4}>
              <h2>
                Average HR: {this.props.store.totalHitrate > 0 ? this.props.store.totalHitrate.toFixed(2)* 100 + "%" : "-"}
              </h2>
              <table className="hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>HR</th>
                  </tr>
                </thead>
                <tbody>
                  {hitList}
                </tbody>
              </table>
            </Column>
          </Row>
        </div>
      </div>
    );
  }
}

export default DashPage;
