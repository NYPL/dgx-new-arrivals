import React from 'react';
import Radium from 'radium';
import cx from 'classnames';

class Dropdown extends React.Component {
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
        <div className={"dropdown-display" + (this.state.listVisible ? " clicked": "")} onClick={this.show}>
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

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  _onClick(toggleValue) {
    this.props.onClick(toggleValue);
  }

  render() {
    const options = ['books', 'any', 'music', 'dvds'];
    const dropdown = <Dropdown list={options} selected={options[0]} />;
    const select = <select value="books" className="search-select">
              <option value="books">Books</option>
              <option value="dvds">DVDs</option>
              <option value="music">Music</option>
            </select>;
    return (
      <div className="search-container">
        <h3>I want to browse...</h3>

        <div className="search-form">
          <div className="inputs">
            {dropdown}
            
            <input placeholder="Search the catalog" className="search-field"/>
          </div>

          <button
            className="search-button">
            Search
          </button>
        </div>

        <p className="advanceSearch"><a href="#">Advance Search ></a></p>

      </div>
    );
  }
}

export default Radium(Search);
