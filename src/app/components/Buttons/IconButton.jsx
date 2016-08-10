import React from 'react';

class IconButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.onClick();
  }

  render() {
    return (
      <button
        className={`${this.props.className} svgIcon`}
        onClick={this.onClick}
      >
        {this.props.icon}
        <span className="visuallyHidden">{this.props.label}</span>
      </button>
    );
  }
}

IconButton.propTypes = {
  onClick: React.PropTypes.func,
  className: React.PropTypes.string,
  label: React.PropTypes.string,
  icon: React.PropTypes.object,
};

export default IconButton;
