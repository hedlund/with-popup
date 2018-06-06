import withSinglePopup from './SinglePopup';
import withMultiPopup from './MultiPopup';

export const withPopup = config => {
  if (typeof config === 'function' || typeof config.render === 'function') {
    return withSinglePopup(config);
  }
  return withMultiPopup(config);
};
