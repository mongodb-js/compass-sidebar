import { combineReducers } from 'redux';

import databases, {
  INITIAL_STATE as DATABASES_INITIAL_STATE
} from 'modules/databases';
import description, {
  INITIAL_STATE as DESCRIPTION_INITIAL_STATE
} from 'modules/description';
import instance, {
  INITIAL_STATE as INSTANCE_INITIAL_STATE
} from 'modules/instance';
import filterRegex, {
  INITIAL_STATE as FILTER_REGEX_INITIAL_STATE
} from 'modules/filter-regex';
import isCollapsed, {
  INITIAL_STATE as IS_COLLAPSED_INITIAL_STATE
} from 'modules/is-collapsed';
import isWritable, {
  INITIAL_STATE as IS_WRITABLE_INITIAL_STATE
} from 'modules/is-writable';
import appRegistry, {
  appRegistryEmit,
  INITIAL_STATE as APP_REGISTRY_INITIAL_STATE
} from 'modules/app-registry';
import { RESET } from 'modules/reset';

const parseNs = require('mongodb-ns');

export const INITIAL_STATE = {
  appRegistry: APP_REGISTRY_INITIAL_STATE,
  databases: DATABASES_INITIAL_STATE,
  description: DESCRIPTION_INITIAL_STATE,
  instance: INSTANCE_INITIAL_STATE,
  filterRegex: FILTER_REGEX_INITIAL_STATE,
  isCollapsed: IS_COLLAPSED_INITIAL_STATE,
  isWritable: IS_WRITABLE_INITIAL_STATE
};

/**
 * The reducer.
 */
const reducer = combineReducers({
  databases,
  description,
  instance,
  filterRegex,
  isCollapsed,
  isWritable,
  appRegistry
});

/**
 * The root reducer.
 *
 * @param {Object} state - The state.
 * @param {Object} action - The action.
 *
 * @returns {Object} The new state.
 */
const rootReducer = (state, action) => {
  if (action.type === RESET) {
    return {
      ...state,
      ...INITIAL_STATE
    };
  }
  return reducer(state, action);
};

/**
 * Opens the drop collection global dialog from `compass-collectons-ddl`.
 *
 * @emits open-drop-collection
 * @param {String} ns Namespace string of the collection to drop.
 * @returns {Function} The thunk
 */
export const dropCollection = (ns) => {
  return (dispatch) => {
    const { database, collection } = parseNs(ns);
    dispatch(appRegistryEmit('open-drop-collection', database, collection));
  };
};

/**
 * Selects the namespace, a.k.a. open a collection.
 *
 * @emits select-namespace
 * @param {String} ns Namespace string of the collection to select.
 * @param {Boolean} [isReadonly] If the collection is a view.
 * @param {String} [viewOn] Colleection name a view is based on.
 * @returns {Function} The thunk
 */
export const openCollection = (ns, isReadonly, viewOn) => {
  return (dispatch) => {
    dispatch(appRegistryEmit('select-namespace', ns, isReadonly, viewOn));

    const ipc = require('hadron-ipc');
    ipc.call('window:show-collection-submenu');
  };
};

/**
 * Open the create collection dialog.
 *
 * @emits open-create-collection
 * @param {String} databaseName Which database the collection will be created under.
 * @returns {Function} The thunk
 */
export const createCollection = (databaseName) => {
  return (dispatch) => {
    dispatch(appRegistryEmit('open-create-collection', databaseName));
  };
};

/**
 * Open database details.
 *
 * @param {String} ns The database name
 * @returns {Function} The thunk
 */
export const openDatabase = (ns) => {
  return (dispatch, getState) => {
    const state = getState();
    const NamespaceStore = state.appRegistry.getStore('App.NamespaceStore');

    if (NamespaceStore.ns === ns) {
      return;
    }

    NamespaceStore.ns = ns;

    const CollectionStore = state.appRegistry.getStore('App.CollectionStore');
    CollectionStore.setCollection({});

    const ipc = require('hadron-ipc');
    ipc.call('window:hide-collection-submenu');
  };
};

/**
 * Open the create database dialog.
 * @emits open-create-database
 * @returns {Function} The thunk
 */
export const createDatabase = () => {
  return (dispatch) => {
    dispatch(appRegistryEmit('open-create-database'));
  };
};

/**
 * Open the drop database dialog.
 *
 * @emits open-drop-database
 * @param {String} ns The database name.
 * @returns {Function} The thunk
 */
export const dropDatabase = (ns) => {
  return (dispatch) => {
    dispatch(appRegistryEmit('open-drop-database', ns));
  };
};

/**
 * Open the drop view dialog.
 *
 * @emits open-drop-view
 * @param {String} ns The view namespace string.
 * @returns {Function} The thunk
 */
export const dropView = (ns) => {
  return (dispatch) => {
    dispatch(appRegistryEmit('open-drop-view', ns));
  };
};

/**
 * Opens the aggregation plugin to modify the view.
 *
 * @emits open-modify-view
 * @param {String} ns The view namespace string.
 * @returns {Function} The thunk
 */
export const modifyView = (ns) => {
  return (dispatch) => {
    dispatch(appRegistryEmit('open-modify-view', ns));
  };
};

export default rootReducer;
