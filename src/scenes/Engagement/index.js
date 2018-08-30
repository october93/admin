import React, { Component } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import { getEngagement } from '../../store/actions/engagement'
import {
	FaCheck,
	FaClose
} from 'react-icons/lib/fa'
import glamorous from "glamorous"

const CheckBox = () => {
	return (
		<glamorous.Div
			textAlign={'center'}
			backgroundColor={'#77dd77'}
			color={'green'}
			width={'100%'}
			height={'100%'}><FaCheck size={15} /></glamorous.Div>
	)
}

const CrossBox = () => {
	return (
		<glamorous.Div
			textAlign={'center'}
			backgroundColor={'#ff6961'}
			color={'#c30000'}
			width={'100%'}
			height={'100%'}><FaClose size={15} /></glamorous.Div>
	)
}

const AtLeastOnce = (props) => {
	if (props.value >= 1) {
		return <CheckBox />
	} else {
		return <CrossBox />
	}
}

class EngagementPage extends Component {
	columns = [{
		Header: 'User',
		accessor: 'username',
		width: 250,
	},{
		Header: 'Two Days',
		accessor: 'engagement.daysActive',
		Cell: props => {
			if (props.value >= 2) {
				return <CheckBox />
			} else {
				return <CrossBox />
			}
		}
	},{
		Header: 'Posted',
		accessor: 'engagement.postCount',
		Cell: AtLeastOnce
	},{
		Header: 'Commented',
		accessor: 'engagement.commentCount',
		Cell: AtLeastOnce
	},{
		Header: 'Voted',
		accessor: 'engagement.votedCount',
		Cell: AtLeastOnce
	},{
		Header: 'Received Votes',
		accessor: 'engagement.receivedVotesCount',
		Cell: AtLeastOnce
	},{
		Header: 'Reacted',
		accessor: 'engagement.reactedCount',
		Cell: AtLeastOnce
	},{
		Header: 'Received Reactions',
		accessor: 'engagement.receivedReactionsCount',
		Cell: AtLeastOnce
	},{
		Header: 'Followed',
		accessor: 'engagement.followedUsersCount',
		Cell: AtLeastOnce
	},{
		Header: 'Invited',
		accessor: 'engagement.invitedCount',
		Cell: AtLeastOnce
	},{
		Header: 'Score',
		accessor: 'engagement.score',
		Cell: (props) => (
			<div>{Math.round((props.value * 100))}%</div>
		)
	}
	]

  componentDidMount() {
		this.props.getEngagement()
	}

	render() {
		return (
			<div>
				<ReactTable
					columns={this.columns}
					data={this.props.engagements}
					defaultPageSize={50}
          getTdProps={(state, rowInfo, column) => {
            let style = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
							padding: 0,
							width: '25px',
							height: '25px',
            }
            if (column.id === 'username') {
              style.justifyContent = 'left'
            }
            return { style }
          }}
				/>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	engagements: state.engagements
})

const mapDispatchToProps = {
	getEngagement
}

export default connect(mapStateToProps, mapDispatchToProps)(EngagementPage)
