import glamorous from "glamorous"

const Button = glamorous.button(({ color, backgroundColor }) => ({
  backgroundColor: backgroundColor || "white",
  color: color || "black",
  border: "1px black solid",
  borderRadius: "5px",
  padding: "6px",
  height: "auto",
  
}))

export default Button
