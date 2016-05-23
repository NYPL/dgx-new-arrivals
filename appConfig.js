export default {
  appTitle: 'NYPL | Welcome to The New York Public Library',
  appName: 'Homepage',
  favIconPath: 'http://ux-static.nypl.org.s3-website-us-east-1.amazonaws.com/images/favicon.ico',
  port: 3001,
  webpackDevServerPort: 3000,
  api: {
    root: {
      development: 'https://dev-refinery.nypl.org',
      qa: 'https://qa-refinery.nypl.org',
      production: 'https://refinery.nypl.org',
    },
  },
  newArrivalsApi: {
    base: 'http://10.224.6.14:8083/inventory',
    audience: 'http://10.224.6.14:8083/inventory/audience',
    bibItems: 'http://10.224.6.14:8083/inventory/bibItems',
    formats: 'http://10.224.6.14:8083/inventory/formats',
    languages: 'http://10.224.6.14:8083/inventory/languages',
    availableQueries: ['audience', 'bibNumber', 'days', 'format', 'language', 'pageNum', 'itemCount'],
  },
  headerApi: {
    endpoint: '/api/nypl/ndo/v0.1/site-data/header-items',
    includes: [
      'children',
      'related-mega-menu-panes.current-mega-menu-item.images',
      'related-mega-menu-panes.current-mega-menu-item.related-content.authors.nypl-location',
      'related-mega-menu-panes.current-mega-menu-item.related-content.location',
      'related-mega-menu-panes.default-mega-menu-item.images',
      'related-mega-menu-panes.default-mega-menu-item.related-content.authors.nypl-location',
      'related-mega-menu-panes.default-mega-menu-item.related-content.location'
    ],
    filters: {
      'relationships': {'parent': 'null'}
    }
  },
  itemTitleLength: 96,
  appFilters: {
    formatData: {
      title: 'Format',
      data:[
        { id: 'BOOK/TEXT', label: 'Book' },
        { id: 'AUDIOBOOK', label: 'Audiobook' },
        { id: 'BLU-RAY', label: 'Blu-ray' },
        { id: 'DVD', label: 'DVD' },
        { id: 'E-AUDIOBOOK', label: 'E-Audiobook' },
        { id: 'E-BOOK', label: 'E-Book' },
        { id: 'LARGE PRINT', label: 'Large Print' },
        { id: 'MUSIC CD', label: 'Music CD' },
      ],
      active: '',
    },
    audienceData: {
      title: 'Audience',
      data: [
        { id: 'Adult', label: 'Adult' },
        { id: 'Children', label: 'Children' },
        { id: 'Young Adult', label: 'Young Adult' },
      ],
      active: '',
    },
    languageData: {
      title: 'Language',
      data: [
        { id: 'English', label: 'English' },
        { id: 'Spanish', label: 'Spanish' },
        { id: 'Chinese', label: 'Chinese' },
        { id: 'Russian', label: 'Russian' },
        { id: 'French', label: 'French' },
      ],
      active: '',
    },
    genreData: {
      title: 'Genre',
      data: [
        { id: 'Fiction', label: 'Fiction' },
        { id: 'Non fiction', label: 'Non Fiction' },
        { id: 'Research', label: 'Research' },
      ],
      active: '',
    },
  },
  introText: 'Use filters to browse new books, DVDs, and music by language, age level, ' +
    'and genre. Toggle to list view to see more information about each title. Check back ' +
    'regularly to see our most recently acquired materials.',
};
