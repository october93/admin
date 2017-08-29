import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Column, Row  } from 'react-foundation'

import './style.scss'

@inject("store") @observer
class DashPage extends Component {
  state = {
    from: this.props.store.dashboardFromTime,
    to: this.props.store.dashboardToTime,
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
      <tr key={i} className={ i === 0 ? "firstRow" : ""}>
        <td>{data.name}</td>
        <td>{data.metric > 0 ? data.metric: "-"}</td>
      </tr>
    )

    const likesList = this.props.store.likeRankings.toJS().map((data, i) =>
      <tr key={i} className={ i === 0 ? "firstRow" : ""}>
        <td>{data.name}</td>
        <td>{data.metric > 0 ? data.metric: "-"}</td>
      </tr>
    )

    const hitList = this.props.store.hitRateRankings.toJS().map((data, i) =>
      <tr key={i} className={ i === 0 ? "firstRow" : ""}>
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
