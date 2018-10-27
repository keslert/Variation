import React from 'react';
import classnames from 'classnames';

const Switch = ({
  on,
  onClick,
}) => (
  <div className={classnames('switch', {on})} onClick={() => onClick()}>
    <div className="switch-toggle"></div>
  </div>
)

export default Switch;
