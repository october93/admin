import React, { Component } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import { getEngagement } from '../../store/actions/engagement'
import {
	FaCheck,
	FaClose
} from 'react-icons/lib/fa'
import glamorous from "glamorous"
import { DateRangePicker } from 'react-dates';
import moment from 'moment';

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
		Header: 'Logged in Twice',
		accessor: 'engagement.daysActive',
		Cell: props => {
			if (props.value >= 2) {
				return <CheckBox />
			} else {
				return <CrossBox />
			}
		},
		width: 150,
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
		Cell: AtLeastOnce,
		width: 150,
	},{
		Header: 'Reacted',
		accessor: 'engagement.reactedCount',
		Cell: AtLeastOnce
	},{
		Header: 'Received Reactions',
		accessor: 'engagement.receivedReactionsCount',
		Cell: AtLeastOnce,
		width: 150,
	},{
		Header: 'Followed',
		accessor: 'engagement.followedUsersCount',
		Cell: AtLeastOnce
	},{
		Header: 'Got Followed',
		accessor: 'engagement.followedCount',
		Cell: AtLeastOnce,
		width: 150,
	},{
		Header: 'Invited',
		accessor: 'engagement.invitedCount',
		Cell: AtLeastOnce
	},{
		id: 'score',
		Header: 'Score',
		accessor: 'engagement.score',
		Cell: (props) => (
			<div>{Math.round((props.value * 100))}%</div>
		)
	}
	]

	constructor() {
		super()
		this.state = {
			startDate: moment().startOf('month'),
			endDate: moment(),
			focusedInput: null
		}
		this.onDatesChange.bind(this)
	}

  componentDidMount() {
		this.props.getEngagement(this.state.startDate, this.state.endDate)
	}

	onDatesChange({startDate, endDate}) {
		this.setState({ startDate, endDate })
		this.props.getEngagement(this.state.startDate, this.state.endDate)
	}

	render() {
		return (
			<div>
				<DateRangePicker
					startDate={this.state.startDate}
					startDateId="your_unique_start_date_id"
					endDate={this.state.endDate}
					endDateId="your_unique_end_date_id"
					onDatesChange={this.onDatesChange.bind(this)}
					focusedInput={this.state.focusedInput}
					onFocusChange={focusedInput => this.setState({ focusedInput })}
					isOutsideRange={(props) => { return props.isBefore(moment("20180709", "YYYYMMDD")) }}
				/>
				<ReactTable
					columns={this.columns}
					data={this.props.engagements}
					defaultPageSize={50}
					defaultSorted={[{ id: "score", desc: true }]}
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