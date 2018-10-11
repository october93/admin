import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from "react-helmet"
import {
  FaBullhorn,
  FaUsers,
  FaUserPlus,
  FaTerminal,
  FaShareAlt,
  FaShieldAlt,
  FaSignOutAlt,
  FaListUl,
  FaHashtag,
  FaChartLine,
} from 'react-icons/fa';

import {
  Container,
	MenuLink,
	MenuItem,
	TitleHeader,
	Logo,
	LogoText,
	SideMenu,
	UserMenuInfo,
	MenuPadding,
	PageContainer,
	Page,
  Separator,
} from "./styled-components"

import logo from './logo-light.png'
import gqlIcon from './gqlIcon.svg'
import { logout } from '../../store/actions/login'

const {
	REACT_APP_ENVIRONMENT,
} = process.env

const GraphQLIcon = ({ size }) => <img style={{width: size, height: size}} src={gqlIcon} alt="gqlicon"/>

const menuItems = [
  {name: "Users", path: "/admin/users", Icon: FaUsers},
  {name: "Channels", path: "/admin/channels", Icon: FaHashtag},
  {name: "Engagement", path: "/admin/users/engagement", Icon: FaChartLine},
  {name: "Invites", path: "/admin/invites", Icon: FaUserPlus},
  {Component: Separator},
  {name: "Console", path: "/admin/rpcconsole", Icon: FaTerminal},
  {name: "GraphQL", path: "/admin/graphql", Icon: GraphQLIcon},
  {Component: Separator},
  {name: "Moderation", path: "/admin/moderation", Icon: FaShieldAlt},
  {name: "Announcements", path: "/admin/announcements", Icon: FaBullhorn},
  {name: "Waitlist", path: "/admin/waitlist", Icon: FaListUl},
]

class AdminLayout extends Component {
  state = {
    showModal: false,
    issueSummary: "",
    issueDetail: "",
    mousedOver: false,
  }

  renderMenuItems = () => {
    return menuItems.map((item, index) => {
      if (item.Component) {
        return <item.Component key={index} big={this.state.mousedOver} />
      }
      const IconComp = item.Icon || FaBullhorn
      return (
      <MenuItem key={item.path}>
        <MenuLink key={item.path} to={item.path}>
          <IconComp size={25} />
          {this.state.mousedOver && <span style={{ marginLeft: "10px" }}>{item.name}</span>}
        </MenuLink>
      </MenuItem>
    )})
  }

  render() {
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

          <SideMenu width={this.state.mousedOver ? "190px" : "65px"} onMouseOver={()=>this.setState({mousedOver: true})} onMouseLeave={()=>this.setState({mousedOver: false})}>
            <TitleHeader to="/">
                <Logo src={logo} alt="logo"/>
                {this.state.mousedOver && <LogoText>Admin</LogoText>}
            </TitleHeader>
            {this.renderMenuItems()}
            <UserMenuInfo>
              <MenuItem onClick={() => this.props.logout()}><FaSignOutAlt size={25}/>
                {this.state.mousedOver && <span style={{ marginLeft: "10px", fontSize: "13px"}}>Logout</span>}
              </MenuItem>
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
