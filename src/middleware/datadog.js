import dogapi from 'dogapi';
import moment from 'moment';
import _ from 'lodash';


let options = {
  api_key: process.env.DATADOG_API_KEY,
  app_key: process.env.DATADOG_APP_KEY,
};

dogapi.initialize(options);

// Datadog middleware
export default ({ getState }) => next => action => {

  // Call the next dispatch method in the middleware chain.
  let returnValue = next(action);

  let state = getState();

  // If we're not initialized yet, just return wait for data
  if (!state.modules.core.sensors || !state.modules.core.controls || action.type !== 'CORE_SENSOR_READINGS_UPDATE') {

    return returnValue;

  }

  let metrics = [
    {
      metric: `${ state.modules.core.settings.datadog.namespace }.temperature`,
      points: parseFloat(state.modules.core.sensors.temperature),
      host: 'pi2',
    },
    {
      metric: `${ state.modules.core.settings.datadog.namespace }.humidity`,
      points: parseFloat(state.modules.core.sensors.humidity),
      host: 'pi2',
    },
    {
      metric: `${ state.modules.core.settings.datadog.namespace }.control.humidifier`,
      points: state.modules.core.controls.humidifier ? 1 : 0,
      host: 'pi2',
    },
    {
      metric: `${ state.modules.core.settings.datadog.namespace }.control.fan`,
      points: state.modules.core.controls.fan ? 1 : 0,
      host: 'pi2',
    },
    {
      metric: `${ state.modules.core.settings.datadog.namespace }.control.light`,
      points: state.modules.core.controls.light ? 1 : 0,
      host: 'pi2',
    },
    {
      metric: `${ state.modules.core.settings.datadog.namespace }.control.freshAir`,
      points: state.modules.core.controls.freshAir ? 1 : 0,
      host: 'pi2',
    },
    {
      metric: `${ state.modules.core.settings.datadog.namespace }.events.state`,
      points: state.modules.core.events.state,
      host: 'pi2',
    },
    {
      metric: `${ state.modules.core.settings.datadog.namespace }.events.queue`,
      points: _.reduce(state.modules.core.events.queue, 'type'),
      host: 'pi2',
    },
  ];

  dogapi.metric.send_all(metrics, (err, results) => {

    console.dir(results);

  });

  return returnValue;

};
