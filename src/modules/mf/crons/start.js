import * as core from '../../core';
import * as constants from '../constants';

export default (store) => {

  store.dispatch({
    type: core.constants.CORE_EVENT_START,
    state: constants.MF_EVENT_0_COOLDOWN_TICK,
    queueable: true,
  });

};
