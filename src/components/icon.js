import React from "react"
import PropTypes from "prop-types"
import glamorous from "glamorous"
import ReactSVG from "react-svg"

const IconContainer = glamorous.div(({ size }) => ({
	pointerEvents: "none",
	// Hack, fixes bug: 24px icons are improperly rendered with 26px height
	"& > div": {
		height: size,
	},
	"& > div > div": {
		height: size,
	},
}))

const IconSVG = glamorous(ReactSVG)(({ color, size }) => ({
	fill: color,
	height: size,
	width: size,
}))

const Icon = ({ name, color, size, light, ...rest }) => {
	const path = require(`@october/october-icons/dist/${name}.svg`)
	if (light) color = "#FFFFFF"
	return (
		<IconContainer size={size} {...rest}>
			<IconSVG path={path} color={color} size={size} />
		</IconContainer>
	)
}

Icon.propTypes = {
	name: PropTypes.string.isRequired,
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

Icon.defaultProps = {
	color: "#7F7F7F",
	size: "1.5rem",
}

export default Icon
