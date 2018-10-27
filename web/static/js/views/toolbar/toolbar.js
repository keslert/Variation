import React from 'react';
import { Link }  from 'react-router';

let Toolbar = ({
  children
}) => (
  <div className="toolbar">
    <Link to="/app" className="logo">Variation</Link>
    {children}
  </div>
)

export default Toolbar;
