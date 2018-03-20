import * as redux from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-cli-logger';
import moment from 'moment';

import controller from './middleware/controller';
import datadog from './middleware/datadog';
import modules from './modules';

const loggerOptions = {
  predicate: (getState, action) => !action.MONITOR_ACTION,
};

export const createStore = ({ initialState = {
  modules: {
    core: {
      settings: {
        light: {
          on: 12,
          off: 0,
        },
        humidifier: {
          on: 90.0,
          off: 95.0,
        },
        dehumidifier: {
          on: 95,
          off: 90,
        },
        datadog: {
          namespace: process.env.DATADOG_NAMESPACE || 'cc',
        },
        circulation: {
          interval: 60 * 30,
          duration: 1000 * 30,
        },
      },
      sensors: {
        temperature: null,
        humidity: null,
        time: null,
      },
      controls: {
        humidifier: false,
        fan: false,
        light: false,
        freshAir: false,
      },
      events: {
        startedAt: null,
        state: null,
        queue: [],
        priorControls: null,
      },
    },
    mf: {
      settings: {
        interval: 60 * 60 * 6, // in seconds
        cooldownDuration: 60 * 5,
        mistingDuration: 60 * 5,
        mistUntilHumidityGreaterThan: 99.0,
        condensationDuration: 60 * 3,
        fanUntilHumidityLessThan: 80,
      },
    },
  },
} }) => {

  // Only include certain middleware in production mode
  let middleware = [thunk, createLogger(loggerOptions)];
  if (!process.env.LOCAL_DEVELOPMENT) {

    middleware = middleware.concat([controller, datadog]);

  }

  // Combine all the reducers of each module
  let reducerSwitch = {};
  for (let module in modules) {

    reducerSwitch = Object.assign(reducerSwitch, modules[module].reducers);

  }

  return redux.createStore(
    (state, action) => {

      if (!reducerSwitch[action.type]) return state;
      return reducerSwitch[action.type](state, action);

    },
    initialState,
    redux.applyMiddleware(...middleware),
  );

};
