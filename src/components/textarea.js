import TextareaAutosize from "react-autosize-textarea"
import glamorous from "glamorous"

const Textarea = glamorous(TextareaAutosize)({
  width: window.innerWidth - 10,
  minHeight: "100px",

  "&:focus": {
    outline: "none",
  },
})

export default Textarea
