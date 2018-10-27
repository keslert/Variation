import React from 'react';
import classnames  from 'classnames';
import Tooltip from 'rc-tooltip';

let IconButton = ({
  className,
  icon,
  onClick,
  hover
}) => {
  if(hover) {
    return (
      <Tooltip placement="left"
               overlay={hover}
               mouseEnterDelay={0.5}>
        <div className={classnames('btn', className)}
             onClick={onClick} >
          <i className={`fa fa-${icon}`}></i>
        </div>
      </Tooltip>
    )
  }

  return (
    <div className={classnames('btn', className)}
         onClick={onClick} >
      <i className={`fa fa-${icon}`}></i>
    </div>
  )
}

export default IconButton;
