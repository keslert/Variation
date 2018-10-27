import React from 'react';

let Optional = ({
  show,
  children
}) => {
  if(!show) {
    return <div></div>;
  }

  return children;
}

export default Optional;
