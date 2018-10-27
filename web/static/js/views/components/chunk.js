import React      from 'react';
import classnames from 'classnames'

let Chunk = ({
  text,
  top,
  left,
  fontFamily,
  fontStyle,
  fontWeight,
  fontSize,
  height,
  lineHeight,
  textShadow,
  important
}) => {
  return (
  <div className={classnames('chunk', {important})}
       style={{
        left: `${left}px`,
        top: `${top}px`,
        height: `${fontSize}px`,
        lineHeight: `${lineHeight}px`,
        fontFamily, fontStyle, fontSize, textShadow, fontWeight
       }}>
    {text}
  </div>
  )
}

Chunk.propTypes = {
  text: React.PropTypes.string.isRequired,
  top: React.PropTypes.number.isRequired,
  left: React.PropTypes.number.isRequired,
  fontFamily: React.PropTypes.string.isRequired,
  fontStyle: React.PropTypes.string.isRequired,
  fontSize: React.PropTypes.number.isRequired,
  textShadow: React.PropTypes.string,
  important: React.PropTypes.bool
}

export default Chunk;
