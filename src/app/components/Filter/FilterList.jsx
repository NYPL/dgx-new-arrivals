import React from 'react';

import { map as _map } from 'underscore';

import FilterListItem from './FilterListItem.jsx';

import { trackNewArrivals } from '../../utils/utils.js';

// Only select one filter per category
class FilterList extends React.Component {
  constructor(props) {
    super(props);

    this.setActive = this.setActive.bind(this);
  }

  setActive(item) {
    const title = this.props.list.title;
    let gaAction = 'Select: ';

    // console.log(this.refs.item);
    if (this.props.list.active === item) {
      this.props.manageSelected({
        filter: title,
        selected: `Any${title}`,
      });
      gaAction = 'Unselect: ';
    } else {
      this.props.manageSelected({
        filter: title,
        selected: item,
      });
    }

    trackNewArrivals(gaAction, `${title} - ${item}`);
  }

  renderList(list) {
    const activeItem = this.props.list.active;

    return _map(list, (item, i) =>
      (<FilterListItem
        item={item}
        filter={this.props.list.title}
        active={activeItem === item.id}
        key={i}
        onClick={() => this.setActive(item.id)}
      />)
    );
  }

  render() {
    const list = this.renderList(this.props.list.data);

    return (
      <fieldset tabIndex="0" className="filterList">
        <legend className="title">{this.props.list.title}</legend>
        {list}
      </fieldset>
    );
  }
}

FilterList.propTypes = {
  manageSelected: React.PropTypes.func,
  list: React.PropTypes.object,
};

export default FilterList;
