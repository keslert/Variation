import React from 'react';

const InputRange = ({
  value,
  min,
  max,
  onChange
}) => (
  <div className="input-range">
    <span>{Math.ceil(value)}</span>
    <input type="range"
           min={min}
           max={max}
           value={value}
           onChange={(e) => onChange(e.target.value) } />
  </div>
)

export default InputRange;
