import moment from 'moment';
import { dht } from '../../../middleware/controller';
import * as constants from '../constants';

export default (store) => {

  let readout = dht.read();

  store.dispatch({
    type: constants.CORE_SENSOR_READINGS_UPDATE,
    temperature: readout.temperature.toFixed(2),
    humidity: readout.humidity.toFixed(2),
    time: moment(),
  });

};
