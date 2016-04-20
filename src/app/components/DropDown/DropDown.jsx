import React from 'react';
import cx from 'classnames';

import Actions from '../../actions/Actions.js';

/**
 * An Alt based drop down component
 */
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

  /**
   * Triggers the action for the option that was selected.
   * @param {string} item - The selected item key.
   */
  selectDropDownItem(item) {
    this.state.selected = item;
    this.toggleDropDown();
    Actions.updateDropDownValue(this.state.selected);
  }

  /**
   * Toggles the visibility of the drop down menu.
   */
  toggleDropDown() {
    this.setState({
      listVisible: !this.state.listVisible,
    });
  }

  /**
   * Renders a list of items.
   */
  renderListItems() {
    return this.props.list.map((item, i) => {
      if (this.state.selected === item) {
        return undefined;
      }

      return (
        <li key={i} onClick={this.selectDropDownItem.bind(this, item)}>
          <span>{item}</span>
        </li>
      );
    });
  }

  render() {
    const iconClass = cx({
      'nypl-icon-wedge-up': this.state.listVisible,
      'nypl-icon-wedge-down': !this.state.listVisible,
    });
    const visibleClass = cx({ show: this.state.listVisible });

    return (
      <div className={`dropdown-container search-select ${visibleClass}`}>
        <div
          className="dropdown-display"
          onClick={this.toggleDropDown}
        >
          <span>{this.state.selected}</span>
          <span className={`${iconClass} icon`}></span>
        </div>
        <div className="dropdown-list">
          <ul>
            {this.renderListItems()}
          </ul>
        </div>
      </div>
    );
  }
}

DropDown.propTypes = {
  selected: React.PropTypes.string,
  list: React.PropTypes.object,
};

export default DropDown;
