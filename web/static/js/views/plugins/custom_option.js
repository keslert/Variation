import React  from 'react';
import Switch from '../components/switch';
import Select from 'react-select';
import SmartNumberInput from '../components/smart_number_input';

class CustomOption extends React.Component {

  _renderInput() {
    const { type, min, max, value, setValue, units } = this.props;

    let _onChange = _.debounce(setValue, 200);

    return (
      <div className="element number">
        <SmartNumberInput min={min} max={max} value={Math.floor(value)}
                          onChange={(value) => _onChange(value)} />
        <span>{units || 'px'}</span>
      </div>
    )
  }

  _renderDropdown() {
    const { options, value, setValue } = this.props;

    let _options = options.map(option => ({value: option, label: option}));
    return (
      <div className="element">
        <Select value={value}
                options={_options}
                onChange={({value}) => setValue(value)}
                clearable={false} />
      </div>
    )
  }

  renderElement() {
    switch(this.props.element) {
      case 'input':
        return this._renderInput();
      case 'dropdown':
        return this._renderDropdown();
    }
  }

  render() {
    const { label } = this.props;
    return (
      <ul className="row custom">
        <li className="list-unstyled">
          {label}
          {this.renderElement()}
        </li>
      </ul>
    )
  }
}

export default CustomOption;
