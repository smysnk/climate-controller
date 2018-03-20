import moment from 'moment';
import * as constants from '../constants';


export default (state = {}, action) => {

  let terminationTime = moment(state.modules.core.events.startedAt).add(state.modules.mf.settings.condensationDuration, 's');
  if (moment() < terminationTime) {

    return state;

  }

  // Progress on to next state
  state.modules.core.events.state = constants.MF_EVENT_3_FANNING_TICK;
  state.modules.core.events.startedAt = moment();

  return state;

};
