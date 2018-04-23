import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from "react-helmet"

import {
  Container,
	MenuLink,
	MenuItem,
	TitleHeader,
	Logo,
	LogoText,
	SideMenu,
	UserMenuInfo,
	LoggedInAs,
	MenuPadding,
	PageContainer,
	Page,
} from "./styled-components"

import logo from './logo-light.png'

import { logout } from '../../store/actions/login'

const {
	REACT_APP_ENVIRONMENT,
} = process.env

const menuItems = [
  {name: "Moderation", path: "/admin/moderation"},
  {name: "Announcements", path: "/admin/announcements"},
  {name: "Users", path: "/admin/users"},
  {name: "Reactions", path: "/admin/reactions"},
  {name: "Cards", path: "/admin/cards"},
  {name: "Tags", path: "/admin/tags"},
  {name: "Invites", path: "/admin/invites"},
  {name: "Feature Switches", path: "/admin/featureswitches"},
  {name: "Console", path: "/admin/rpcconsole"},
  {name: "Graph", path: "/admin/graph"},
  {name: "GraphQL", path: "/admin/graphql"},
  {name: "Waitlist", path: "/admin/waitlist"},
  {name: "Who Is Online", path: "/admin/whoisonline"},
]

class AdminLayout extends Component {
  state = {
    showModal: false,
    issueSummary: "",
    issueDetail: "",
  }

  renderMenuItems = () => {
    return menuItems.map(item => (
      <MenuItem key={item.path}>
        <MenuLink isCurrentPage={this.props.location.pathname === item.path} key={item.path} to={item.path}>{item.name}</MenuLink>
      </MenuItem>
    ))
  }

  render() {
    const profile = JSON.parse(localStorage.getItem("session"))

    let appName = "October Admin"

    if (REACT_APP_ENVIRONMENT === "dev") {
      appName += " Development"
    } else if (REACT_APP_ENVIRONMENT === "local") {
      appName += " Local"
    }

    return (
    		<Container>
          {
            REACT_APP_ENVIRONMENT !== "prod" &&
            <Helmet>
              <title>{appName}</title>
            </Helmet>
          }

          <SideMenu>
            <TitleHeader to="/">
                <Logo src={logo} alt="logo"/>
                <LogoText>Admin</LogoText>
            </TitleHeader>
            {this.renderMenuItems()}
            <UserMenuInfo>
              <MenuItem>
                <LoggedInAs>
                  Welcome,
                </LoggedInAs>
                {profile ? profile.username : "User"}
              </MenuItem>
              <MenuItem onClick={() => this.props.logout()}>Logout</MenuItem>
            </UserMenuInfo>
          </SideMenu>
          <PageContainer>
            <MenuPadding />
      			<Page>
              {this.props.children}
            </Page>
          </PageContainer>
    		</Container>

    )
  }
}

const mapDispatchToProps = {
  logout,
}

export default connect(state => state, mapDispatchToProps)(AdminLayout)
