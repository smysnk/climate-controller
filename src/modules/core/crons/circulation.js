import * as constants from '../constants';

export default (store) => {

  store.dispatch({
    type: constants.CORE_EVENT_START,
    state: constants.CORE_EVENT_CIRCULATION_TICK,
    queueable: true,
  });

};
