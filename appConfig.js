export default {
  appTitle: 'New Arrivals | The New York Public Library',
  appName: 'Homepage',
  favIconPath: '//d2znry4lg8s0tq.cloudfront.net/images/favicon.ico',
  port: 3001,
  webpackDevServerPort: 3000,
  api: {
    root: {
      development: 'https://dev-refinery.nypl.org',
      qa: 'https://qa-refinery.nypl.org',
      production: 'https://refinery.nypl.org',
    },
  },
  inventoryService: {
    root: {
      development: 'https://dev-inventory.nypl.org',
      qa: 'https://qa-inventory.nypl.org',
      production: 'https://inventory.nypl.org',
    },
    base: '/inventory',
    audience: '/inventory/audience',
    bibItems: '/inventory/bibItems',
    formats: '/inventory/formats',
    languages: '/inventory/languages',
    availableQueries: ['audience', 'bibNumber', 'days', 'format', 'language', 'pageNum', 'itemCount'],
  },
  headerApi: {
    endpoint: '/api/nypl/ndo/v0.1/site-data/header-items',
    includes: [
      'children',
      'related-container-slots.current-item.square-image',
    ],
    filters: {
      'relationships': { 'parent': 'null' },
    },
  },
  itemTitleLength: 65,
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
        { id: 'Research', label: 'Research' },
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
        { id: 'Non Fiction', label: 'Non Fiction' },
      ],
      active: '',
    },
  },
  titleRemovedText: /(\[sound recording\])|(\[videorecording\])|(\[electronic resource\])/,
  authorRemovedText: /(\(Musical group.*\))|(\(Musician\))|(composer, performer.)|(performer, composer.)/,
  availability: {
    newArrival: { id: 'New Arrival', label: 'New Arrivals' },
    onOrder: { id: 'On Order', label: 'On Order' },
  },
  publicationType: {
    recentlyReleased: { id: 'recentlyReleased', label: `${new Date().getFullYear() - 1}+` },
    anyYear: { id: 'anyYear', label: 'Any Year' },
  },
  introText: 'Use filters to browse new books, DVDs, and music by language, age level, ' +
    'and genre. Toggle to list view to see more information about each title. Check back ' +
    'regularly to see our most recently acquired materials.',
  currentYear: new Date().getFullYear(),
  languageDays: 30,
  languageItemCount: 100,
  itemCount: 18,
  pageNum: 1,
};
