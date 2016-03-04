import React from 'react';
import cx from 'classnames';

import Actions from '../../actions/Actions.js';

class DropDown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listVisible: false,
      selected: this.props.selected,
    };

    this.select = this.select.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  select(item) {
    this.state.selected = item;
    Actions.updateDropDownValue(this.state.selected);
  }

  show() {
    this.setState({ listVisible: true });
    document.addEventListener('click', this.hide);
  }

  hide() {
    this.setState({ listVisible: false });
    document.removeEventListener('click', this.hide);
  }

  renderListItems() {
    return this.props.list.map((item, i) => {
      if (this.state.selected === item) {
        return;
      }

      return (
        <div key={i} onClick={this.select.bind(this, item)}>
          <span>{item}</span>
        </div>
      );
    });
  }

  render() {
    const iconClass = cx({
      'nypl-icon-wedge-up': this.state.listVisible,
      'nypl-icon-wedge-down': !this.state.listVisible
    });

    return (<div className={"dropdown-container search-select " + (this.state.listVisible ? " show" : "")}>
        <div className={"dropdown-display" + (this.state.listVisible ? " clicked": "")}
          onClick={this.show}>
          <span>{this.state.selected}</span>
          <span className={`${iconClass} icon`}></span>
        </div>
        <div className="dropdown-list">
          <div>
            {this.renderListItems()}
          </div>
        </div>
      </div>);
  }
}

export default DropDown;
