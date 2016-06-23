import React from 'react';

import { CircleDashIcon } from 'dgx-svg-icons';

const FilterListItem = (props) => {
  const activeClass = props.active ? 'active' : '';
  const formatId = (props.item.id).replace(/\s+/g, '');

  return (
    <div className={activeClass}>
      <input
        type="radio"
        className="switch-input"
        id={formatId}
        name={props.filter}
        onClick={props.onClick}
        value={props.item.label}
      />
      <label htmlFor={formatId}>
        {props.active ? <CircleDashIcon /> : null}
        {props.item.label}
      </label>
    </div>
  );
};

FilterListItem.propTypes = {
  onClick: React.PropTypes.func,
  item: React.PropTypes.object,
  active: React.PropTypes.bool,
  filter: React.PropTypes.string,
};

export default FilterListItem;
