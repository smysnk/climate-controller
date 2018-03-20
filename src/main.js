import express from 'express';

import thunk from 'redux-thunk';
import * as redux from './redux';

import * as webcam from './webcam';
import * as aws from './aws';
import modules from './modules';


const store = redux.createStore({});

// Initialize all module cron jobs
for (let module in modules) {

  modules[module].crons.initialize(store);

}

console.log('Ready!');


const app = express();

app.post('/', (req, res) => {

  store.dispatch({
    type: modules.core.constants.CORE_EVENT_START,
    state: req.query.event,
    queueable: true,
  });

  res.send('Success!');

});

app.listen(3000, () => console.log('Climate Controller listening on port 3000!'));
