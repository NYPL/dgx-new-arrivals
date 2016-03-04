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

    this.selectDropDownItem = this.selectDropDownItem.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
  }

  selectDropDownItem(item) {
    this.state.selected = item;
    this.toggleDropDown();
    Actions.updateDropDownValue(this.state.selected);
  }

  toggleDropDown() {
    this.setState({
      listVisible: !this.state.listVisible
    });
  }

  renderListItems() {
    return this.props.list.map((item, i) => {
      if (this.state.selected === item) {
        return;
      }

      return (
        <div key={i} onClick={this.selectDropDownItem.bind(this, item)}>
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
    const visibleClass = cx({ 'show' : this.state.listVisible });

    return (
      <div className={`dropdown-container search-select ${visibleClass}`}>
        <div className="dropdown-display"
          onClick={this.toggleDropDown}>
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
