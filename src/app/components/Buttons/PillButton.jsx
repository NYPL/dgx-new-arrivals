import React from 'react';

/**
 * Button used to display an icon and text. Should be updated with an svg
 * instead of font icon.
 * @extends {React}
 */
class PillButton extends React.Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);
  }

  /**
   * Handle click event on the button. Triggers the `onClick` function
   * that is passed to this component.
   * @param {string} value - A boolean or string value passed to the
   * Alt Actions.
   */
  _onClick(value) {
    this.props.onClick(value);
  }

  /**
   * Renders the component.
   */
  render() {
    return (
      <button
        className={`PillButton ${this.props.className} ${this.props.value}`}
        onClick={this._onClick.bind(this, this.props.value)}
      >
        {this.props.icon}
        <span className={`PillButton-title`}>{this.props.title}</span>
        <span className={`${this.props.iconClass} icon`}></span>
      </button>
    );
  }
}

PillButton.propTypes = {
  onClick: React.PropTypes.func,
  className: React.PropTypes.string,
  value: React.PropTypes.string,
  iconClass: React.PropTypes.string,
  icon: React.PropTypes.object,
  title: React.PropTypes.string,
};

export default PillButton;
