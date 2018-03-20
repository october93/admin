import React from 'react'
import glamorous from "glamorous"

export default glamorous("div", {
	rootEl: "div",
	filterProps: ["spacing"],
	propsAreCssOverrides: true,
})(
	{
		display: "flex",
    flexDirection: "row",
    alignItems: "center",
	},
	({ spacing }) => ({
		"& > *:not(:last-child)": {
			marginRight: spacing || null,
		},
	}),
)
