import React, { Component } from 'react'
import glamorous from "glamorous"
import PropTypes from "prop-types"

import TextInput from '../../components/textinput'
import Link from '../../components/link'

const RowItemContainer = glamorous.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "5px 0px",

  "&:hover": {
    backgroundColor: "#eaf6ff",
  }
})

const NoRows = glamorous.div({
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#00000033",
})

const RowProfileImage = glamorous.img({
  height: "30px",
  width: "30px",
  borderRadius: "100%",
  objectFit: "cover",
})

const RowUserName = glamorous.span({
  fontSize: "14px",
  marginLeft: "10px",
})

const RowItem = ({ item, onClick }) => {
  const { username, profileImagePath, displayName } = item

  return (
    <RowItemContainer key={username} onClick={onClick}>
      <RowProfileImage src={profileImagePath} />
      <RowUserName>
        <b>{`${displayName.substring(0, 20)}${displayName.length > 20 ? "..." : ""}`}</b> {username}
      </RowUserName>
    </RowItemContainer>
  )
}

const RowItems = ({ items, onClick, emptyString}) =>
  items && items.length ?
    items.map( item => (
      <RowItem
        item={item}
        onClick={() => onClick(item)}
      />
  )) : (
    <NoRows>{emptyString}</NoRows>
  )


const ScrollContainer = glamorous.div({ overflow: "scroll", flex: 1})

const Label = glamorous.div({
  padding: "15px 0px",
  fontSize: "16px",
  fontWeight: "bold",
})

const SearchBox = glamorous(TextInput)({
  border: "none",
  padding: "0px 0px 15px 0px",
})

const ListContainer = glamorous.div({
  flex: 1,
  display: "flex",
  flexDirection: "column",
})

const Container = glamorous.div({
  height: "400px",
  display: "flex",
  flexDirection: "row",
})

class ListSelector extends Component {
  static propTypes = {
    unselectedLabel: PropTypes.string,
    selectedLabel: PropTypes.string,
    unselectedItems: PropTypes.array.isRequired,
    selectedItems: PropTypes.array.isRequired,
    addToSelected: PropTypes.func.isRequired,
    removeFromSelected: PropTypes.func.isRequired,
    selectAll: PropTypes.func.isRequired,
    removeAll: PropTypes.func.isRequired,
	}

  static defaultProps = {
    unselectedLabel: "Unselected",
    selectedLabel: "Selected",
  }

  state = {
    unselectedItemsFilter: "",
    selectedItemsFilter: "",
  }

  render() {
    const {
      addToSelected,
      removeFromSelected,
      selectAll,
      removeAll,
      selectedItems,
      unselectedItems,
      unselectedLabel,
      selectedLabel,
    } = this.props

    let {
      selectedItemsFilter,
      unselectedItemsFilter,
    } = this.state

    selectedItemsFilter = selectedItemsFilter.toLowerCase()
    unselectedItemsFilter = unselectedItemsFilter.toLowerCase()

    const filteredUnselectedItems = unselectedItemsFilter ? unselectedItems.filter(u => u.username.startsWith(unselectedItemsFilter) || u.displayName.toLowerCase().startsWith(unselectedItemsFilter)) : unselectedItems
    const filteredSelectedItems = selectedItemsFilter ? selectedItems.filter(u => u.username.startsWith(selectedItemsFilter) || u.displayName.toLowerCase().startsWith(selectedItemsFilter)) : selectedItems

    return (
      <Container>
        <ListContainer>
          <Label>{`${unselectedLabel} (${unselectedItems.length})`} <Link onClick={selectAll}>(Add All)</Link></Label>
          <SearchBox placeholder={"Search"} value={unselectedItemsFilter} onChange={e => this.setState({unselectedItemsFilter: e.target.value})}/>
          <ScrollContainer>
            <RowItems
              items={filteredUnselectedItems}
              onClick={addToSelected}
              emptyString={unselectedItems.length ? "No Results" : "No Items"}
            />
          </ScrollContainer>
        </ListContainer>

        <ListContainer>
          <Label>{`${selectedLabel} (${selectedItems.length})`} <Link onClick={removeAll}>(Remove All)</Link></Label>
          <SearchBox placeholder={"Search"} value={selectedItemsFilter} onChange={e => this.setState({selectedItemsFilter: e.target.value})}/>
          <ScrollContainer>
            <RowItems
              items={filteredSelectedItems}
              onClick={removeFromSelected}
              emptyString={selectedItems.length ? "No Results" : "No Items"}
            />
          </ScrollContainer>
        </ListContainer>
      </Container>
    )
  }
}

export default ListSelector
