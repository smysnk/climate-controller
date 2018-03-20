import start from './start';

const initialize = (store) => {

  // Initiate a misting / fanning event every 6 hours
  setInterval(() => {

    start(store);

  }, 1000 * 60 * 60 * 6);

};

export {
  start,
  initialize,
};
