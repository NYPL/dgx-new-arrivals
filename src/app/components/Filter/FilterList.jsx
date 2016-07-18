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

    if (this.props.list.active === item) {
      this.props.manageSelected({
        filter: title,
        selected: '',
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

  renderDivider() {
    return (<div className="subdivider" key="divider"></div>);
  }

  renderList(list) {
    const activeItem = this.props.list.active;

    let returnedList = _map(list, (item, i) =>
      (<FilterListItem
        item={item}
        filter={this.props.list.title}
        active={activeItem === item.id}
        key={i}
        onClick={() => this.setActive(item.id)}
      />)
    );

    if (this.props.list.title === 'Genre') {
      returnedList.splice(2, 0, this.renderDivider());
    }

    return returnedList;
  }

  render() {
    const list = this.renderList(this.props.list.data);

    return (
      <fieldset tabIndex="0" className="filterList">
        <legend className="title">
          <h3>{this.props.list.title}</h3>
        </legend>
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
