import React from 'react';

import FilterListItem from './FilterListItem.jsx';

import { map as _map } from 'underscore';

// Only select one filter per category
class FilterList extends React.Component {
  constructor(props) {
    super(props);

    this.setActive = this.setActive.bind(this);
  }

  setActive(item) {
    const title = this.props.list.title;

    if (this.props.list.active === item) {
      this.props.manageSelected({
        filter: title,
        selected: '',
      });
    } else {
      this.props.manageSelected({
        filter: title,
        selected: item,
      });
    }
  }

  renderList(list) {
    const activeItem = this.props.list.active;

    return _map(list, (item, i) =>
      (<FilterListItem
        item={item.label}
        filter={this.props.list.title}
        active={activeItem === item.id}
        key={i}
        onClick={this.setActive.bind(this, item.id)}
      />)
    );
  }

  render() {
    const list = this.renderList(this.props.list.data);

    return (
      <li className="FilterList">
        <div className="inner">
          <h3>{this.props.list.title}</h3>
        </div>
        <ul>
          {list}
        </ul>
      </li>
    );
  }
}

FilterList.propTypes = {
  manageSelected: React.PropTypes.func,
  list: React.PropTypes.object,
};

export default FilterList;
