import React from 'react';

class SmartNumberInput extends React.Component {

  constructor() {
    super();
    this.state = {
      editing: false,
      value: ''
    }
  }

  onFocus() {
    this.setState({
      editing: true,
      value: this.props.value
    })
  }

  onChange(value) {
    if(_.isInteger(value)) {
      this.setState({ value })
      this.props.onChange(value);
    } else {
      this.setState({ value: '' })
    }
  }

  onBlur() {
    this.setState({
      editing: false
    })
  }

  render() {
    const { min, max, value } = this.props;

    return (
      <input type="number"
             min={min}
             max={max}
             value={ this.state.editing ? this.state.value : value }
             onFocus={() => this.onFocus()}
             onBlur={() => this.onBlur()}
             onChange={(e) => this.onChange(parseInt(e.target.value))} />
    )
  }
}

export default SmartNumberInput;
