import React from 'react';
import Radium from 'radium';

class PillButton extends React.Component {
  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);
  }

  _onClick(toggleValue) {
    this.props.onClick(toggleValue);
  }

  render() {
    return (
      <button
        className={`PillButton ${this.props.className}${this.props.iconClass}`}
        onClick={this._onClick.bind(this, this.props.toggleValue)}>
        <span className="icon"></span>
        <span className={`PillButton-title`}>{this.props.title}</span>
      </button>
    );
  }
}

export default Radium(PillButton);
