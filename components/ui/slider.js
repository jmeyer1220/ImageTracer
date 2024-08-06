// Slider.js
import React from 'react';
import PropTypes from 'prop-types';

const Slider = ({ value, onValueChange, min, max, step }) => {
  const handleChange = (event) => {
    onValueChange([parseInt(event.target.value, 10)]);
  };

  return (
    <input
      type="range"
      value={value[0]}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      className="slider"
    />
  );
};

Slider.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  onValueChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
};

export default Slider;
