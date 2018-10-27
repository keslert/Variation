import React from 'react';
import classnames  from 'classnames';

let TextButton = ({
  className,
  text,
  onClick
}) => (
  <div className={classnames('btn', className)}
       onClick={onClick} >
    {text}
  </div>
)

export default TextButton;
