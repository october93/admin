import React from 'react'
import Link from "../link"

const { REACT_APP_APP_HOST } = process.env

const CardLink = ({ cardID }) => <Link href={`${REACT_APP_APP_HOST}/post/${cardID}`} target="_blank">{cardID}</Link>

export default CardLink
