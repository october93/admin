import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from "react-helmet"
import {
  FaBullhorn,
  FaGroup,
  FaComment,
  FaUserPlus,
  FaToggleOn,
  FaTerminal,
  FaShareAlt,
  FaShield,
  FaSignOut,
  FaListUl,
  FaWifi,
} from 'react-icons/lib/fa';

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
} from "./styled-components"

import logo from './logo-light.png'
import gqlIcon from './gqlIcon.svg'
import { logout } from '../../store/actions/login'

const {
	REACT_APP_ENVIRONMENT,
} = process.env

const GraphQLIcon = ({ size }) => <img style={{width: size, height: size}} src={gqlIcon}/>

const menuItems = [
  {name: "Moderation", path: "/admin/moderation", Icon: FaShield},
  {name: "Announcements", path: "/admin/announcements", Icon: FaBullhorn},
  {name: "Users", path: "/admin/users", Icon: FaGroup},
  {name: "Cards", path: "/admin/cards", Icon: FaComment},
  {name: "Invites", path: "/admin/invites", Icon: FaUserPlus},
  {name: "Feature Switches", path: "/admin/featureswitches", Icon: FaToggleOn},
  {name: "Console", path: "/admin/rpcconsole", Icon: FaTerminal},
  {name: "Graph", path: "/admin/graph", Icon: FaShareAlt},
  {name: "GraphQL", path: "/admin/graphql", Icon: GraphQLIcon},
  {name: "Waitlist", path: "/admin/waitlist", Icon: FaListUl},
  {name: "Who Is Online", path: "/admin/whoisonline", Icon: FaWifi},
]

class AdminLayout extends Component {
  state = {
    showModal: false,
    issueSummary: "",
    issueDetail: "",
    mousedOver: false,
  }

  renderMenuItems = () => {
    return menuItems.map(item => {
      const IconComp = item.Icon || FaBullhorn
      return (
      <MenuItem key={item.path}>
        <MenuLink isCurrentPage={this.props.location.pathname === item.path} key={item.path} to={item.path}>
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
              <MenuItem onClick={() => this.props.logout()}><FaSignOut size={25}/>
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
