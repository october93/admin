import React, { Component } from 'react'
import { getTags, createTag } from '../../store/actions/tags'
import { connect } from 'react-redux'

import Error from '../../components/error'
import glamorous from "glamorous"

const StyledForm = glamorous.form({
  width: "20rem",
  marginBottom: "3rem",
})

class Tags extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.props.getTags()
  }

  handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.createTag(this.state.handle, this.state.name, this.state.info)
  }

  render() {
    if (this.props.isLoading) {
      return "Loading…"
    }
    if (this.props.loadError) {
      return <Error>{this.props.loadError.message}</Error>
    }
    if (this.props.createError) {
      return <Error>{this.props.createError.message}</Error>
    }
    const Tags = (
      (this.props.tags.tags || []).map((tag, i) => (
        <tr key={i}>
          <td>{tag.handle}</td>
          <td>{tag.name}</td>
          <td>{tag.info}</td>
        </tr>
    ))
    )
    return (
      <div style={{ width: "100%" }}>
        <p>New Tag</p>
        <StyledForm>
          <input type="text" name="handle" placeholder="Handle" onChange={this.handleChange} />
          <input type="text" name="name" placeholder="Name" onChange={this.handleChange} />
          <input type="text" name="info" placeholder="Info" onChange={this.handleChange} />
          <input type="submit" value="Create" onClick={this.handleSubmit} />
        </StyledForm>
        <table>
          <thead>
            <tr>
              <th>Handle</th>
              <th>Name</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {Tags}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.tagsLoading,
    tags: state.getTagsSuccessful,
    loadError: state.getTagsFailed,
    createSuccess: state.createTagSuccess,
    createError: state.createTagFailed,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTags: (url) => dispatch(getTags(url)),
    createTag: (url, handle, name, info) => dispatch(createTag(url, handle, name, info)),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags)
