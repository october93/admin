import React, { Component } from 'react'
import { Link } from 'react-foundation'
import { observer, inject } from 'mobx-react'
import { Column, Row  } from 'react-foundation';

import './style.scss';

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
  render() {
    const profile = JSON.parse(localStorage.getItem("profile"))
    const auth = this.props.store.auth

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
          <h2>This week...</h2>
          <Row className="display">
            <Column small={4}>
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
            <Column small={4}>
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
            <Column small={4}>
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
