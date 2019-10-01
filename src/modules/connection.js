/**
 * Change connection action name.
 */
export const CHANGE_CONNECTION = 'sidebar/connection/CHANGE_CONNECTION';

/**
 * The initial state of the connection.
 */
export const INITIAL_STATE = {};

/**
 * Reducer function for handle state change of the connection.
 *
 * @param {String} state - The state.
 * @param {Object} action - The action.
 *
 * @returns {String} The new state.
 */
export default function reducer(state = INITIAL_STATE, action) {
  if (action.type === CHANGE_CONNECTION) {
    return action.connection;
  }
  return state;
}

/**
 * Change connection action creator.
 *
 * @param {Connection} connection - The connection.
 *
 * @returns {Object} The action.
 */
export const changeConnection = (connection) => ({
  type: CHANGE_CONNECTION,
  connection
});
