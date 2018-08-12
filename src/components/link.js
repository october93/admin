import glamorous from "glamorous"

const Link = glamorous.a(({ color }) => ({
  textDecoration: "none",
  color: color || "#02A8F3",
  cursor: "pointer",
}))

export default Link
