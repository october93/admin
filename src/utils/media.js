const breakpoints = {
	lv16: 1536,
	lv15: 1440,
	lv14: 1344,
	lv13: 1248,
	lv12: 1152,
	lv11: 1056,
	lv10: 960,
	lv9: 864,
	lv8: 768,
	lv7: 672,
	lv6: 576,
	lv5: 480,
	lv4: 384,
	lv3: 288,
	lv2: 192,
	lv1: 96,
	lv0: 0,
}

const px2em = px => {
	return `${px / 16}em`
}


const vw = Object.keys(breakpoints).reduce((mixin, key) => {
	mixin[key] = `@media (min-width: ${px2em(breakpoints[key])})`
	return mixin
}, {})

const vh = Object.keys(breakpoints).reduce((mixin, key) => {
	mixin[key] = `@media (min-height: ${px2em(breakpoints[key])})`
	return mixin
}, {})

export { vw, vh }
