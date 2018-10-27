import React from 'react';

let ToolbarItem = ({
  label,
  icon,
  children
}) => (
  <div className="toolbar-item">
    <div className="label">
      {label}
      {icon && <i className={`fa fa-${icon}`}></i>}
    </div>
    {children}
  </div>
)

export default ToolbarItem;
