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
  appRegistryEmit, INITIAL_STATE as APP_REGISTRY_INITIAL_STATE
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
 */
export const dropCollection = ns => {
  const { database, collection } = parseNs(ns);
  appRegistryEmit(
    'open-drop-collection',
    database,
    collection
  );
};

/**
 * Selects the namespace, a.k.a. open a collection.
 *
 * @emits select-namespace
 * @param {String} ns Namespace string of the collection to select.
 */
export const openCollection = (ns, isReadonly, viewOn) => {
  return (dispatch) => {
    dispatch(appRegistryEmit(
      'select-namespace',
      ns,
      isReadonly,
      viewOn
    ));

    const ipc = require('hadron-ipc');
    ipc.call('window:show-collection-submenu');
  };
};

export const createCollection = (database) => {
  return (dispatch) => {
    dispatch(appRegistryEmit('open-create-collection', database));
  };
};

export const openDatabase = ns => {
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

export const createDatabase = () => {
  return dispatch => {
    dispatch(appRegistryEmit('open-create-database'));
  };
};

export const dropDatabase = ns => {
  return (dispatch) => {
    dispatch(appRegistryEmit('open-drop-database', ns));
  };
};

export default rootReducer;
