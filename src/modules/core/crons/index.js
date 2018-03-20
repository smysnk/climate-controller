import moment from 'moment';

import sensors from './sensors';
import events from './events';
import onoff from './onoff';
import circulation from './circulation';

const initialize = (store) => {

  // Keeps the sensor information current
  setInterval(() => {

    sensors(store);

  }, 1000 * 10);

  // Helps drive the event engine
  setInterval(() => {

    events(store);

  }, 1000);

  // Triggers for any settings that use on / off values
  setInterval(() => {

    onoff(store);

  }, 1000);

  // Trigger any interval type cron jobs
  setInterval(() => {

    let { modules: { core: { settings } } } = store.getState();
    if ((moment().unix() % settings.circulation.interval) === 0) {

      circulation(store);

    }

  }, 1000);

};

export {
  sensors,
  events,
  onoff,
  circulation,
  initialize,
};
