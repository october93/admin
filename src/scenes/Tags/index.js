import React, { Component } from 'react'
import { getTags, createTag } from '../../store/actions/tags'
import { connect } from 'react-redux'

import Error from '../../components/error'
import Button from '../../components/button'
import TextInput from '../../components/textinput'
import glamorous from "glamorous"

const StyledForm = glamorous.form({
  width: "20rem",
  marginBottom: "3rem",
})

const Tag = glamorous.span({
  margin: "5px",
  borderRadius: "25px",
  padding: "8px 15px",
  border: "1px solid #CCC",
  backgroundColor: "#EEE",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const TagContainer = glamorous.div({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  padding: "0px 10px"
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
    this.props.createTag(this.state.handle)
  }

  render() {
    if (this.props.isLoading) {
      return "Loading…"
    }
    if (this.props.loadError) {
      return <Error>{this.props.loadError.message}</Error>
    }
    const Tags = (
      (this.props.tags.tags || []).map((tag, i) => (
          <Tag key={i}>{tag.handle}</Tag>
    ))
    )
    return (
      <div style={{ width: "100%" }}>
        { this.props.createError &&
          <Error>{this.props.createError.message}</Error>
        }
        <p>New Tag</p>
        <StyledForm>
          <TextInput type="text" name="handle" placeholder="Handle" onChange={this.handleChange} />
          <Button type="submit" onClick={this.handleSubmit}>Create</Button>
        </StyledForm>

        <TagContainer>
          {Tags}
        </TagContainer>

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

const mapDispatchToProps = {
  getTags,
  createTag,
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags)
