import TextareaAutosize from "react-autosize-textarea"
import glamorous from "glamorous"

const Textarea = glamorous(TextareaAutosize)(({ disabled }) => ({
  width: "100%",
  minHeight: "100px",
  color: disabled ? "#AAA" : "#000",

  "&:focus": {
    outline: "none",
  },
}))

export default Textarea
