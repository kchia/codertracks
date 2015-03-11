'use strict';
/** @jsx React.DOM */

jest.dontMock('../../client/app/stores/DevSearchStore');
jest.dontMock('object-assign');

describe('DevSearchStore', function() {

  // var TodoConstants = require('../../constants/TodoConstants');
  var AppDispatcher;
  var DevSearchStore;
  var callback;

  // mock actions 
  var actionDisplayLanguageData = {
    actionType: 'DISPLAY_LANGUAGE_DATA',
    input: 'Ruby'
  };

  var actionDisplayCountryData = {
    actionType: 'DISPLAY_COUNTRY_DATA',
    input: 'Jamaica'
  };

  var actionSwitchWorkflow = {
    actionType: 'SWITCH_WORKFLOW',
    workflow: 'initialWorkflow'
  };

  beforeEach(function() {
    AppDispatcher = require('../../client/app/dispatcher/AppDispatcher');
    TodoStore = require('../../client/app/stores/DevSearchStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
});
