const config = {
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
  homepageApi: {
    endpoint: '/api/nypl/ndo/v0.1/site-data/containers',
    includes: [
      'slots.current-item.rectangular-image.full-uri',
      'slots.current-item.banner-image.full-uri',
      'slots.current-item.book-cover-image',
      // Should be children.slots but slots comes from above....
      'children.slots.current-item.rectangular-image',
    ],
    filters: {
      // These slug names are under the 'slug' attributes for each container
      slug: 'recommended-recent-releases'
    },
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
};

export default config;

