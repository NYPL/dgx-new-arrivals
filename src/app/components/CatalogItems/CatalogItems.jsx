import React from 'react';

import { findWhere as _findWhere } from 'underscore';

import BookCover from '../BookCover/BookCover.jsx';
import BookListItem from '../Isotopes/BookListItem.jsx';
import appConfig from '../../../../appConfig.js';

import {
  titleAuthorShortener,
  createDate,
  createEncoreLink,
  mapLanguageCode,
} from '../../utils/utils.js';

const { appFilters, itemTitleLength } = appConfig;
const formatData = appFilters.formatData.data;

class CatalogItems extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const bookCoverItems = this.props.items || [];

    if (bookCoverItems.length === 0) {
      return (
        <li className="catalogItem noResults">
          <span>No items found with the selected filters.</span>
        </li>
      );
    }

    const books = bookCoverItems.map((element, i) => {
      const langCode = mapLanguageCode(element.language);
      const target = createEncoreLink(element.bibNumber);
      const {
        title,
        author,
      } = titleAuthorShortener(element.title, element.author, itemTitleLength);
      const bookCover = (
        <BookCover
          imgSrc={element.imageUrl[0] ? element.imageUrl[0] : undefined}
          id={element.bibNumber}
          name={title}
          author={author}
          format={element.format}
          target={target}
          genre={element.genres[0]}
          linkClass="item"
          simple={false}
          displayType={this.props.displayType}
          lang={langCode.code}
        />
      );
      const simpleBookCover = (
        <BookCover
          imgSrc={element.imageUrl[0] ? element.imageUrl[0] : undefined}
          id={element.bibNumber}
          name={title}
          target={target}
          format={element.format}
          linkClass="item"
          displayType={this.props.displayType}
          lang={langCode.code}
        />
      );
      const format = _findWhere(formatData, { id: element.format });
      const formatLabel = format ? `${format.label}` : '';
      const publishYear = element.publishYear ? `, ${element.publishYear}` : '';
      const date = createDate(element.createdDate);
      const bookListItem = (
        <BookListItem
          bookCover={simpleBookCover}
          title={element.title}
          target={target}
          author={element.author}
          format={formatLabel}
          publishYear={publishYear}
          callNumber={element.callNumber}
          description={element.description}
          date={date}
          lang={langCode.code}
        />
      );

      return (
        <li className={`catalogItem ${this.props.displayType}`} key={i}>
          {this.props.displayType === 'grid' ? bookCover : bookListItem}
        </li>
      );
    });

    return (<div className="catalogItems">{books}</div>);
  }
}

CatalogItems.propTypes = {
  items: React.PropTypes.array,
  displayType: React.PropTypes.string,
};

export default CatalogItems;
