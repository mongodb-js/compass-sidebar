import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import ReactTooltip from 'react-tooltip';
import { AutoSizer, List } from 'react-virtualized';

import classnames from 'classnames';
import styles from './sidebar.less';

import SidebarDatabase from 'components/sidebar-database';
import SidebarInstanceProperties from 'components/sidebar-instance-properties';

import { toggleIsCollapsed } from 'modules/is-collapsed';
import { filterDatabases, changeDatabases } from 'modules/databases';
import { changeFilterRegex } from 'modules/filter-regex';
import {
  dropCollection,
  openCollection,
  createCollection,
  dropDatabase,
  openDatabase,
  createDatabase,
  dropView,
  modifyView
} from 'modules/index';

import { TOOLTIP_IDS } from 'constants/sidebar-constants';

const OVER_SCAN_COUNT = 100;
const ROW_HEIGHT = 28;
const EXPANDED_WHITESPACE = 12;

class Sidebar extends PureComponent {
  static displayName = 'Sidebar';
  static propTypes = {
    databases: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
    filterRegex: PropTypes.any.isRequired,
    instance: PropTypes.object.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    isWritable: PropTypes.bool.isRequired,
    onCollapse: PropTypes.func.isRequired,
    toggleIsCollapsed: PropTypes.func.isRequired,
    filterDatabases: PropTypes.func.isRequired,
    changeDatabases: PropTypes.func.isRequired,
    changeFilterRegex: PropTypes.func.isRequired,
    dropCollection: PropTypes.func.isRequired,
    openCollection: PropTypes.func.isRequired,
    createCollection: PropTypes.func.isRequired,
    dropDatabase: PropTypes.func.isRequired,
    openDatabase: PropTypes.func.isRequired,
    createDatabase: PropTypes.func.isRequired,
    modifyView: PropTypes.func.isRequired,
    dropView: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.StatusActions = global.hadronApp.appRegistry.getAction(
      'Status.Actions'
    );
  }

  componentWillReceiveProps() {
    this.list.recomputeRowHeights();
  }

  componentDidUpdate() {
    // Re-render tooltips once data has been fetched from mongo/d/s in a
    // performant way for data.mongodb.parts (~1500 collections)
    ReactTooltip.rebuild();
  }

  getSidebarClasses() {}

  getToggleClasses() {}

  handleCollapse = () => {
    if (!this.props.isCollapsed) {
      this.props.onCollapse();
      if (this.StatusActions) {
        this.StatusActions.configure({ sidebar: false });
      }
      this.props.toggleIsCollapsed(!this.props.isCollapsed);
    }
  }

  handleExpand = () => {
    if (this.props.isCollapsed) {
      this.props.onCollapse();
      if (this.StatusActions) {
        this.StatusActions.configure({ sidebar: false });
      }
      this.props.toggleIsCollapsed(!this.props.isCollapsed);
    }
  }

  handleSearchFocus = () => {
    this.refs.filter.focus();
  }

  handleFilter = (event) => {
    const searchString = event.target.value;

    let re;
    try {
      re = new RegExp(searchString, 'i');
    } catch (e) {
      re = /(?:)/;
    }

    this.props.changeFilterRegex(re);
    this.props.filterDatabases(re, null, null);
  };

  handleCreateDatabaseClick = () => {
    if (this.props.isWritable) {
      this.props.createDatabase();
    }
  };

  _calculateRowHeight = ({ index }) => {
    const db = this.props.databases.databases[index];
    let height = ROW_HEIGHT;
    if (this.props.databases.expandedDblist[db._id]) {
      height += db.collections.length * ROW_HEIGHT + EXPANDED_WHITESPACE;
    }
    return height;
  }

  /**
   * Set the reference of the List object to call public methods of react-virtualized
   * see link: https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#public-methods
   *
   * @param {Object} ref The `react-virtualized.List` reference used here
   */
  _setRef = (ref) => {
    this.list = ref;
  }

  /**
   * Display while sidebar list is being loaded
   * @return {DOM} element
   */
  retrievingDatabases() {
    return null;
  }

  /**
   * @returns {Boolean} If this is the READ_ONLY distribution of Compass.
   */
  isReadonlyDistro() {
    return process.env.HADRON_READONLY === 'true';
  }

  /**
   * On expand/collapse of sidebar-database, add/remove from `expandedDblists`
   * state and recompute row heights.
   *
   * @param {String} _id The namespace string of the database being toggled.
   * @todo (lucas) Move to reducer.
   */
  handleDatabaseExpandedToggled = (_id) => {
    const expandedDB = cloneDeep(this.props.databases.expandedDblist);
    expandedDB[_id] = !expandedDB[_id];

    this.props.changeDatabases(
      this.props.databases.databases,
      expandedDB,
      this.props.databases.activeNamespace
    );
    this.list.recomputeRowHeights();
  };

  renderCreateDatabaseButton() {
    if (this.isReadonlyDistro()) {
      return null;
    }
    const tooltipText = this.props.description;
    const tooltipOptions = this.props.isWritable
      ? {}
      : {
        'data-for': TOOLTIP_IDS.CREATE_DATABASE_BUTTON,
        'data-effect': 'solid',
        'data-place': 'right',
        'data-offset': "{'right': -10}",
        'data-tip': tooltipText
      };

    const isW = !this.props.isWritable
      ? styles['compass-sidebar-button-is-disabled']
      : '';
    const className = classnames(
      styles['compass-sidebar-button-create-database'],
      styles[isW]
    );
    return (
      <div
        className={styles['compass-sidebar-button-create-database-container']}
        {...tooltipOptions}>
        <button
          className={className}
          title="Create Database"
          onClick={this.handleCreateDatabaseClick}>
          <i className="mms-icon-add" />
          <div className={styles['plus-button']}>Create Database</div>
        </button>
      </div>
    );
  }

  renderSidebarDatabase = ({ index, key, style }) => {
    const db = this.props.databases.databases[index];
    const props = {
      isWritable: this.props.isWritable,
      description: this.props.description,
      _id: db._id,
      activeNamespace: this.props.databases.activeNamespace,
      collections: db.collections,
      expanded: this.props.databases.expandedDblist[db._id],
      onExpandedToggled: this.handleDatabaseExpandedToggled,
      dropCollection: this.props.dropCollection,
      openCollection: this.props.openCollection,
      createCollection: this.props.createCollection,
      openDatabase: this.props.openDatabase,
      dropDatabase: this.props.dropDatabase,
      modifyView: this.props.modifyView,
      dropView: this.props.dropView,
      key,
      style,
      index
    };
    return <SidebarDatabase {...props} />;
  }

  renderToggleSidebar() {
    const caretDirection = this.props.isCollapsed ? 'right' : 'left';
    return (
      <button
        className={classnames(
          styles['compass-sidebar-toggle'],
          'btn btn-default btn-sm'
        )}
        onClick={this.handleCollapse}
        data-test-id="toggle-sidebar">
        <i className={classnames('fa', `fa-caret-${caretDirection}`)} />
      </button>
    );
  }

  renderSidebarFilter() {
    return (
      <div
        className={styles['compass-sidebar-filter']}
        onClick={this.handleSearchFocus}>
        <i
          className={classnames(
            'fa',
            'fa-search',
            styles['compass-sidebar-search-icon']
          )}
        />
        <input
          data-test-id="sidebar-filter-input"
          ref="filter"
          className={styles['compass-sidebar-search-input']}
          placeholder="filter"
          onChange={this.handleFilter}
        />
      </div>
    );
  }

  renderSidebarContent() {
    return (
      <div className={styles['compass-sidebar-content']}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              className="compass-sidebar-autosizer-list"
              overScanRowCount={OVER_SCAN_COUNT}
              rowCount={this.props.databases.databases.length}
              rowHeight={this._calculateRowHeight}
              noRowsRenderer={this.retrievingDatabases}
              rowRenderer={this.renderSidebarDatabase}
              ref={this._setRef}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

  render() {
    const rootClassName = classnames(
      styles['compass-sidebar'],
      styles[
        `compass-sidebar-${this.props.isCollapsed ? 'collapsed' : 'expanded'}`
      ]
    );

    return (
      <div
        className={rootClassName}
        data-test-id="instance-sidebar"
        onClick={this.handleExpand}>
        {this.renderToggleSidebar()}
        <SidebarInstanceProperties
          instance={this.props.instance}
          activeNamespace={this.props.databases.activeNamespace}
        />
        {this.renderSidebarFilter()}
        {this.renderSidebarContent()}
        {this.renderCreateDatabaseButton()}
        <ReactTooltip id={TOOLTIP_IDS.CREATE_DATABASE_BUTTON} />
        <ReactTooltip id={TOOLTIP_IDS.CREATE_COLLECTION} />
        <ReactTooltip id={TOOLTIP_IDS.DROP_DATABASE} />
        <ReactTooltip id={TOOLTIP_IDS.DROP_COLLECTION} />
      </div>
    );
  }
}

/**
 * Map the store state to properties to pass to the components.
 *
 * @param {Object} state - The store state.
 * @param {Object} ownProps - Props passed not through the state.
 *
 * @returns {Object} The mapped properties.
 */
const mapStateToProps = (state, ownProps) => ({
  databases: state.databases,
  description: state.description,
  filterRegex: state.filterRegex,
  instance: state.instance,
  isCollapsed: state.isCollapsed,
  isDblistExpanded: state.isDblistExpanded,
  isWritable: state.isWritable,
  onCollapse: ownProps.onCollapse
});

/**
 * Connect the redux store to the component.
 * (dispatch)
 */
const MappedSidebar = connect(
  mapStateToProps,
  {
    toggleIsCollapsed,
    filterDatabases,
    changeDatabases,
    changeFilterRegex,
    dropCollection,
    openCollection,
    createCollection,
    dropDatabase,
    openDatabase,
    createDatabase,
    dropView,
    modifyView
  }
)(Sidebar);

export default MappedSidebar;
export { Sidebar };
