import React from 'react';
import Radium from 'radium';
import cx from 'classnames';

import NewArrivalsStore from '../../stores/Store.js';
import Actions from '../../actions/Actions.js';

class BookDisplayButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = NewArrivalsStore.getState();

    this._handleClick = this._handleClick.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    NewArrivalsStore.listen(this._onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this._onChange);
  }

  _pillButton(label, classprop, clickprop) {
    return (
      <a onClick={this._handleClick.bind(this, clickprop)}>
        <span className={classprop}></span>
        {label}
      </a>
    );
  }

  render() {
    let gridActive = this.state.displayType === 'grid',
      listActive = this.state.displayType !== 'grid';

    const gridActiveButton = cx({ active: gridActive });
    const listActiveButton = cx({ active: listActive });

    return (
      <div className={this.props.className}>
        <ul className={`${this.props.className}-List`}>
          <li className={gridActiveButton}>
            {this._pillButton('COVERS', `${this.props.className}-grid-icon icon`, 'grid')}
          </li>
          <li className={listActiveButton}>
            {this._pillButton('LIST', `${this.props.className}-list-icon icon`, 'list')}
          </li>
        </ul>
      </div>
    );
  }

  /* Utility Methods should be declared below the render method */
  _handleClick(displayType) {
    Actions.updateBookDisplay(displayType);
  }

  _onChange() {
    this.setState(NewArrivalsStore.getState());
  }
};

BookDisplayButtons.defaultProps = {
  className: 'BookDisplayButtons',
  id: 'BookDisplayButtons'
};

export default Radium(BookDisplayButtons);
