import React from 'react';

import FilterListItem from './FilterListItem.jsx';

import { map as _map } from 'underscore';

// Only select one filter per category
class FilterList extends React.Component {
  constructor(props) {
    super(props);

    this._setActive = this._setActive.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  _setActive(item) {
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

  _renderList(list) {
    const activeItem = this.props.list.active;

    return _map(list, (item, i) => {
      return <FilterListItem
              item={item}
              filter={this.props.list.title}
              active={activeItem === item}
              key={i}
              onClick={this._setActive.bind(this, item)} />;
    });
  }

  render() {
    const list = this._renderList(this.props.list.data);

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

export default FilterList;
