import config from '../../../appConfig.js';
import {
  map as _map,
} from 'underscore';

const { appFilters } = config;

const formatFilters = () => {
  const formats = _map(appFilters.formatData.data, format => format.id);
  return formats.join(',');
};

const titleShortener = (title) => {
  if (!title) {
    return '';
  }

  let updatedTitle = title.split(':')[0];

  if (updatedTitle.length > 96) {
    updatedTitle = (updatedTitle.indexOf('/') !== -1) ?
      updatedTitle.split('/')[0] : updatedTitle.substring(0, 96);
  }

  return updatedTitle
}



export {
  formatFilters,
  titleShortener,
};
