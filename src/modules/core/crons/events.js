import * as constants from '../constants';

export default (store) => {

  let { modules: { core: { events } } } = store.getState();
  if (events.state) {

    // Call the active state reducer for each tick
    store.dispatch({
      type: events.state,
    });

  } else if (!events.state && events.queue.length > 0) {

    // If thre is no active state but something is in queue
    store.dispatch({
      type: constants.CORE_EVENT_START,
    });

  }

};
