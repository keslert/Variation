import React from 'react';

const Scaled = ({
  width,
  height,
  scaledWidth,
  scaledHeight,
  children
}) => {

  let scale = 1;
  if(scaledWidth && scaledHeight) {
    scale = Math.min(scaledWidth / width, scaledHeight / height);
  } else if(scaledWidth) {
    scale = scaledWidth / width;
  } else if(scaledHeight) {
    scale = scaledHeight / height;
  }

  return (
    <div className="scaled" style={{width: width * scale, height: height * scale}}>
      <div className="inner" style={{
          transform: `scale(${scale})`,
          WebkitTransform: `scale(${scale})`
        }}>
        {children}
      </div>
    </div>
  )
}

Scaled.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  scaledWidth: React.PropTypes.number,
  scaledHeight: React.PropTypes.number
}

export default Scaled;
