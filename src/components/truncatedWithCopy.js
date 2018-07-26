import React from 'react'
import Tooltip from 'rc-tooltip'
import copy from 'copy-to-clipboard'

import Link from "./link"

const TruncatedWithCopy = ({ label, options, id}) => (
  <Tooltip
    arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
    placement="left"
    overlay={`${id}\n(Click to Copy)`}>
    <Link onClick={() => copy(id)}>
      {id.substring(0, 4)}...
    </Link>
  </Tooltip>
)

export default TruncatedWithCopy
