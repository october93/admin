import { Link } from 'react-router'
import glamorous from "glamorous"

export const Container = glamorous.div({
  height: "100%",
})

export const Separator = glamorous.div(({ big }) => ({
  height: 1,
  margin: "0px 10px",
  backgroundColor: "#FFFFFF66",
}))

export const MenuLink = glamorous(Link)(({ isCurrentPage }) => ({
  textDecoration: "none",
  color: "white",
  fontSize: "13px",
  fontWeight: isCurrentPage ? "bold" : "inherit",
  alignItems: "center",
  display: "flex",
  flexDirection: "row",

  "&:active": {
    color: "white",
  },

  "&:visited": {
    color: "white",
  },

  "&:hover": {
    fontWeight: "bold",
    color: "#FFF",
  },
}))

export const MenuItem = glamorous.div(({ active }) => ({
  margin: "25px 20px",
  color: "white",
  cursor: "pointer",
}))

export const TitleHeader = glamorous(Link)({
  margin: "30px 0px 40px 18px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",

  textDecoration: "none",
  color: "white",

  "&:active": {
    color: "white",
  },

  "&:visited": {
    color: "white",
  },

  "&:hover": {
    fontWeight: "bold",
    color: "#FFF",
  },
})

export const Logo = glamorous.img({
  height: "30px",
  width: "30px",
  marginRight: "10px",
})

export const LogoText = glamorous.span({
  fontSize: "20px",
  fontWeight: "lighter",
})

export const SideMenu = glamorous.div(({width}) => ({
  position: "fixed",
  top: "0px",
  bottom: "0px",
  left: "0px",
  width: width || "150px",
  backgroundColor: "#02A8F3",
  zIndex: 1000,
}))

export const UserMenuInfo = glamorous.div({
  position: "absolute",
  bottom: "20px",
  color: "#FFF",
})

export const MenuPadding = glamorous.div({
  flex: "0 0 65px",
  height: "100%",
})

export const PageContainer = glamorous.div({
  display: "flex",
  flexDirection: "row",
  height: "100%",
})

export const Page = glamorous.div({
  padding: "10px 10px",
  display: "flex",
  height: "100%",
  width: "100%",
})
