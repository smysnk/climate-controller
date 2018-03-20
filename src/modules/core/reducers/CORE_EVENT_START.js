import moment from 'moment';

export default (state = {}, action) => {

  if (!action.state && state.modules.core.events.queue.length === 0) {

    // No state and no queue, this should not happen
    return state;

  } else if (!action.state && state.modules.core.events.queue.length > 0) {

    let event = state.modules.core.events.queue.pop();
    state.modules.core.events = Object.assign(state.modules.core.events, {
      startedAt: moment(),
      state: event.state,
    });
    return state;

  } else if (state.modules.core.events.state && action.queueable) {

    // If an event is already active and the action is queueable, queue it
    state.modules.core.events.queue.push(action);
    return state;

  } else if (state.modules.core.events.state) {

    // If an event is already active and the event is not queueable, ignore it
    return state;

  }

  state.modules.core.events = Object.assign(state.modules.core.events, {
    startedAt: moment(),
    state: action.state,
  });

  return state;

};
