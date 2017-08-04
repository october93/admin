import React, { Component } from 'react'
import { observer, inject  } from 'mobx-react'
import { Link, Sizes, Colors } from 'react-foundation'
import ReactTable from 'react-table'


import './style.scss';

const columns = [{
  Header: 'Name',
  accessor: 'name',
},
{
  id: 'active',
  Header: 'Is Active',
  accessor: d => d.active ? "Active" : "Inactive"
},
{
  Header: 'Posts',
  accessor: "postCount",
}, {
  id: "toggleactive",
  Header: "",
  accessor: d => d,
  Cell: row => (<span><Link onClick={row.value.toggleActive} size={Sizes.SMALL} color={row.value.active ? Colors.ALERT : Colors.SUCCESS}>
    {row.value.active ? "Deactivate" : "Activate"}
  </Link>
  { row.value.postCount === 0 && !row.value.active ? (<Link onClick={row.value.delete} size={Sizes.SMALL} color={Colors.ALERT}>Delete</Link>) : null}
</span>)
}]

@inject("store") @observer
export default class TagsPage extends Component {
  state = {
    newTagName: "",
  }

  inputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  createNewTag = () => {
    if (this.state.newTagName !== "") {
      this.props.store.newTag(this.state.newTagName)
      this.setState({ newTagName: ""})
    }
  }


  render() {
    const tagsRows = this.props.store.tags.toJS().map((data) => {
      data.toggleActive = () => {
        this.props.store.setTagActive(data.tagID, !data.active)
      }
      data.delete = () => {
        this.props.store.deleteTag(data.tagID)
      }
      return data
    })

    return (
      <div>
        <input type="text" value={this.state.newTagName} name="newTagName" onChange={this.inputChange} required />
        <Link color={Colors.PRIMARY} onClick={this.createNewTag}>Create New Tag</Link>
        <ReactTable
         data={tagsRows}
         columns={columns}
         defaultPageSize={20}
        />
      </div>
    )
  }
}
