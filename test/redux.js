import assert from 'assert';
import 'chai/register-should';
import moment from 'moment';

import * as redux from '../src/redux';
import * as mf from '../src/modules/mf';

describe('Redux', () => {

  describe('createStore()', () => {

    it('should be able to initialize store', () => {

      let store = redux.createStore({});

    });

    describe('defaults', () => {

    });

  });

});
