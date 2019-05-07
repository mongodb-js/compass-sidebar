import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { LOADING_STATE } from 'constants/sidebar-constants';

import styles from './sidebar-instance-properties.less';

class SidebarInstanceProperties extends PureComponent {
  static displayName = 'SidebarInstanceProperties';
  static propTypes = {
    instance: PropTypes.object
  };

  handleRefresh = () => {
    global.hadronApp.appRegistry.emit('refresh-data');
  }

  render() {
    const instance = this.props.instance;
    const numDbs = instance.databases === LOADING_STATE ?
      '-' :
      instance.databases.length;
    const numCollections = instance.databases === LOADING_STATE ?
      '-' :
      instance.collections.length;
    const refreshName = 'fa ' + (this.props.instance.databases === LOADING_STATE ?
      'fa-refresh fa-spin' :
      'fa-repeat');

    return (
      <div className={styles['compass-sidebar-properties']}>
        <div className={styles['compass-sidebar-properties-stats']}>
          <div className={styles['compass-sidebar-properties-stats-refresh-button-container']}>
            <button
              onClick={this.handleRefresh}
              className={styles['compass-sidebar-properties-stats-refresh-button']}
              data-test-id="instance-refresh-button">
              <i className={refreshName}/>
            </button>
          </div>
          <div className={styles['compass-sidebar-properties-stats-column']}>
            <span
              data-test-id="sidebar-db-count"
              className={styles['compass-sidebar-properties-stats-strong-property']}>
              {numDbs}
            </span> DBs
          </div>
          <div className={styles['compass-sidebar-properties-stats-column']}>
            <span
              data-test-id="sidebar-collection-count"
              className={styles['compass-sidebar-properties-stats-strong-property']}>
              {numCollections}
            </span> Collections
          </div>
        </div>
      </div>
    );
  }
}

export default SidebarInstanceProperties;
