import React from 'react';
import cx from 'classnames';

import NewArrivalsStore from '../../stores/Store.js';

import DropDown from '../DropDown/DropDown.jsx';

/**
 * The main container for the top Search section of the New Arrivals app.
 */
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchKeywords: '',
      searchOption: 'catalog',
      placeholder: 'Search the catalog',
      placeholderAnimation: null,
      noAnimationBefore: true,
    };

    this.inputChange = this.inputChange.bind(this);
    this.submitSearchRequest = this.submitSearchRequest.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
    this.animationTimer = this.animationTimer.bind(this);
    this.setCatalogUrl = this.setCatalogUrl.bind(this);
    this.setEncoreUrl = this.setEncoreUrl.bind(this);
    this.encoreEncodeSearchString = this.encoreEncodeSearchString.bind(this);
    this.encoreAddScope = this.encoreAddScope.bind(this);
  }

  componentDidMount() {
    NewArrivalsStore.listen(this.onChange);
  }

  componentWillUnmount() {
    NewArrivalsStore.unlisten(this.onChange);
  }

  onChange() {}

  /**
   * submitSearchRequest(value)
   *
   * @param {String} value - The value from the input field.
   */
  submitSearchRequest(value) {
    // Store the data that the user entered
    const requestParameters = {
      keywords: this.state.searchKeywords.trim(),
      // If the value is null, it indicates the function is triggered on desktop version.
      // Then it should get the value for option from state.
      option: value || this.state.searchOption,
    };
    const encoreBaseUrl = 'http://browse.nypl.org/iii/encore/search/';
    const catalogBaseUrl = 'http://www.nypl.org/search/apachesolr_search/';
    let inputKeywords;
    let requestUrl;
    let format = '';

    // Hardcoding the URL values for the different facet selections.
    switch (NewArrivalsStore.getState().dropDownValue) {
      case 'books':
        format = '__Ff%3Afacetmediatype%3Aa%3Aa%3ABOOKLw%3D%3DTEXT%3A%3A';
        break;
      case 'music':
        format = '__Ff%3Afacetmediatype%3Ay%3Ay%3AMUSIC%20CD%3A%3A';
        break;
      case 'dvds':
        format = '__Ff%3Afacetmediatype%3Av%3Av%3ADVD%3A%3A';
        break;
      default:
        break;
    }

    // Decide the search option based on which button the user clicked on mobile version search box
    if (requestParameters.option === 'catalog') {
      requestUrl = this.setEncoreUrl(requestParameters.keywords + format, encoreBaseUrl, 'eng');
    } else if (requestParameters.option === 'website') {
      requestUrl = this.setCatalogUrl(requestParameters.keywords, catalogBaseUrl);
    }

    // This portion is for the interactions if the user doesn't enter any input
    if (!requestParameters.keywords) {
      // The selector for inputKeywords DOM element
      inputKeywords = this.refs.keywords;
      // The new placeholder that tells users there's no keywords input
      this.setState({ placeholder: 'Please enter a search term.' });
      // Trigger the validation animation
      this.animationTimer(inputKeywords);
    } else {
      // Go to the search page
      window.location.assign(requestUrl);
    }
  }

  /**
   * triggerSubmit(event)
   * The fuction listens to the event of enter key.
   * Submit search request if enter is pressed.
   *
   * @param {Event} event
   */
  triggerSubmit(event) {
    if (event && event.charCode === 13) {
      this.submitSearchRequest(null);
    }
  }

  /**
   * animationTimer(element)
   * Add the CSS animation to the placeholder of the keywords Input.
   * It adds the proper class to the html element to trigger the animation,
   * and then removes the class to stop it.
   *
   * @param {DOM Element} element
   */
  animationTimer(element) {
    let frame = 0;
    const animation = setInterval(() => {
      frame ++;
      // Remove the class to stop the animation after 0.1s
      if (frame > 1) {
        clearInterval(animation);
        this.setState({ placeholderAnimation: null });
        // Set animation to be sequential
        this.setState({ noAnimationBefore: false });
      }
    }, 100);

    // Decide which CSS animation is going to perform
    // by adding different classes to the element.
    // It is based on if it is the first time the validation to be triggered.
    if (this.state.noAnimationBefore) {
      this.setState({ placeholderAnimation: 'initial' });
    } else {
      this.setState({ placeholderAnimation: 'sequential' });
    }
  }

  /**
   * setCatalogUrl(searchString, catalogBaseUrl)
   * Returns the final URL for the catalog search.
   * @param {string} SearchString - The value that was search including search facets.
   * @param {string} catalogBaseUrl - The URL of the catalog.
   */
  setCatalogUrl(searchString, catalogBaseUrl) {
    const catalogUrl = catalogBaseUrl || 'http://www.nypl.org/search/apachesolr_search/';

    if (searchString) {
      return catalogUrl + encodeURIComponent(searchString);
    }
  }

  /**
   * encoreEncodeSearchString(string)
   * base64_encoding_map includes special characters that need to be
   * encoded using base64 - these chars are "=","/", "\", "?"
   * character : base64 encoded
   * @param {string} string - The string that needs to be encoded.
   */
  encoreEncodeSearchString(string) {
    const base64EncMap = {
      '=': 'PQ==',
      '/': 'Lw==',
      '\\': 'XA==',
      '?': 'Pw==',
    };

    let encodedString = string;
    let charRegExString;
    let base64Regex;

    Object.keys(base64EncMap).forEach((specialChar) => {
      charRegExString = specialChar.replace(/([\.\*\+\?\^\=\!\:\$\{\}\(\)\|\[\]\/\\])/g, '\\$1');
      base64Regex = new RegExp(charRegExString, 'g');
      encodedString = encodedString.replace(base64Regex, base64EncMap[specialChar]);
    });

    return encodedString;
  }

  /**
   * setEncoreUrl(searchInput, baseUrl, language)
   * Returns the final URL for encore search which, is first encoded, then concatenated by the
   * base encore root url. An optional scope and language may be concatenated as well.
   * @param {string} searchInput - The value of what will be searched.
   * @param {string} baseUrl - The root URL of Encore.
   * @param {string} language - What language should be used.
   * @param {string} scopeString
   */
  setEncoreUrl(searchInput, baseUrl, language, scopeString) {
    const searchTerm = this.encoreEncodeSearchString(searchInput);
    const rootUrl = baseUrl || 'http://browse.nypl.org/iii/encore/search/';
    const defaultLang = (language) ? `?lang=${language}` : '';
    let finalEncoreUrl;

    if (searchTerm) {
      finalEncoreUrl = this.encoreAddScope(rootUrl, searchTerm, scopeString) + defaultLang;
    }

    return finalEncoreUrl;
  }

  /**
   *  inputChange(field, event)
   * Listen to the changes on keywords input field and option input fields.
   * Grab the event value, and change the state.
   *
   * @param {String} field - Input field context.
   * @param {Event Object} event - Passing event as the argument here
   * as FireFox doesn't accept event as a global variable.
   */
  inputChange(field, event) {
    this.setState({ searchKeywords: event.target.value });
  }

  /**
   * encoreAddScope(baseUrl, searchString, scopeString)
   * Enchances the encore url with a possible scope.
   * If no scope is set, adds the required string to be returned as the final url.
   * @param {string} baseUrl - The root URL of Encore.
   * @param {string} searchInput - The value of what will be searched.
   * @param {string} scopeString
   */
  encoreAddScope(baseUrl, searchString, scopeString) {
    return scopeString ?
      `${baseUrl}C__S${searchString}${scopeString}__Orightresult__U` :
      `${baseUrl}C__S${searchString}__Orightresult__U`;
  }

  render() {
    const options = ['any', 'books', 'music', 'dvds'];
    const pulseAnimation = cx({
      'keywords-pulse-fade-in': this.state.placeholderAnimation === 'initial',
      'keywords-pulse': this.state.placeholderAnimation === 'sequential',
    });

    // Need to update when the state updates:
    const advanceKeywords = this.state.keywords ? `&searchString=${this.state.keywords}` : '';
    const advanceURL = `http://browse.nypl.org/iii/encore/home?` +
      `lang=eng&suite=def&advancedSearch=true${advanceKeywords}`;

    return (
      <div className="search-container">
        <h3>I want to browse...</h3>

        <div className="search-form" onKeyPress={this.triggerSubmit}>
          <DropDown
            list={options}
            selected={options[0]}
          />
          <input
            placeholder={this.state.placeholder}
            className={`search-field ${pulseAnimation}`}
            onChange={() => this.inputChange(null)}
            ref="keywords"
          />
          <button
            className="search-button"
            onClick={() => this.submitSearchRequest('catalog')}
          >
            <span className="nypl-icon-magnifier-fat"></span>
            Search
          </button>
        </div>
      </div>
    );
  }
}

export default Search;
