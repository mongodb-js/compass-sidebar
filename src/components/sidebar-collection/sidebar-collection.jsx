import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TOOLTIP_IDS } from 'constants/sidebar-constants';
import toNS from 'mongodb-ns';

import classnames from 'classnames';
import styles from './sidebar-collection.less';

import { Dropdown, MenuItem } from 'react-bootstrap';

class SidebarCollection extends PureComponent {
  static displayName = 'SidebarCollection';
  static propTypes = {
    _id: PropTypes.string.isRequired,
    database: PropTypes.string.isRequired,
    capped: PropTypes.bool.isRequired,
    power_of_two: PropTypes.bool.isRequired,
    readonly: PropTypes.bool.isRequired,
    activeNamespace: PropTypes.string.isRequired,
    isWritable: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    view_on: PropTypes.any, // undefined or string if view
    pipeline: PropTypes.any, // undefined or array if view
    type: PropTypes.oneOf(['collection', 'view']),
    dropCollection: PropTypes.func.isRequired,
    openCollection: PropTypes.func.isRequired,
    modifyView: PropTypes.func.isRequired,
    dropView: PropTypes.func.isRequired
  };

  handleClick = () => {
    this.props.openCollection(
      this.props._id,
      this.props.readonly,
      this.props.view_on
    );
  };

  handleDropCollectionClick = () => {
    if (this.props.isWritable) {
      this.props.dropCollection(this.props._id);
    }
  };

  handleModifyViewClick = () => {
    this.props.modifyView(this.props._id);
  };

  handleDropViewClick = () => {
    this.props.dropView(this.props._id);
  };

  isReadonlyDistro() {
    return process.env.HADRON_READONLY === 'true';
  }

  renderIsReadonly() {
    if (this.props.readonly) {
      return (
        <i
          className={classnames('fa', styles['compass-sidebar-item-view-icon'])}
          title="Read-only View"
          aria-hidden="true"
          data-test-id="sidebar-collection-is-readonly"
        />
      );
    }
  }

  renderDropCollectionButton() {
    if (!this.isReadonlyDistro()) {
      const tooltipText = this.props.isWritable
        ? 'Drop collection'
        : this.props.description;

      const tooltipOptions = {
        'data-for': TOOLTIP_IDS.DROP_COLLECTION,
        'data-effect': 'solid',
        'data-offset': "{'bottom': 10, 'left': -5}",
        'data-tip': tooltipText
      };

      const disabled = !this.props.isWritable
        ? styles['compass-sidebar-icon-is-disabled']
        : '';

      const dropClassName = classnames(
        styles['compass-sidebar-icon'],
        styles['compass-sidebar-icon-drop-collection'],
        'fa',
        'fa-trash-o',
        disabled
      );

      return (
        <i
          className={dropClassName}
          data-test-id="compass-sidebar-icon-drop-collection"
          onClick={this.handleDropCollectionClick}
          {...tooltipOptions}
        />
      );
    }
  }

  renderActions() {
    if (this.props.readonly === false) {
      return this.renderDropCollectionButton();
    }

    return (
      <Dropdown
        className={styles['compass-sidebar-item-actions-ddl-view-dropdown']}
        id={`side-bar-view-actions-${this.props._id}`}>
        <Dropdown.Toggle className="btn-xs btn" />
        <Dropdown.Menu>
          <MenuItem onClick={this.handleModifyViewClick}>
            Modify source pipeline
          </MenuItem>
          <MenuItem
            className={styles['compass-sidebar-item-actions-ddl-view-drop']}
            onClick={this.handleDropViewClick}>
            Drop View
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    const collectionName = toNS(this.props._id).collection;
    const active =
      this.props.activeNamespace === this.props._id
        ? styles['compass-sidebar-item-is-active']
        : '';

    const itemClassName = classnames(
      styles['compass-sidebar-item'],
      styles['compass-sidebar-item-is-actionable'],
      active
    );
    return (
      <div className={itemClassName}>
        <div
          onClick={this.handleClick}
          className={styles['compass-sidebar-item-title']}
          data-test-id="sidebar-collection"
          title={this.props._id}>
          {collectionName}&nbsp;
          {this.renderIsReadonly()}
        </div>
        <div
          className={classnames(
            styles['compass-sidebar-item-actions'],
            styles['compass-sidebar-item-actions-ddl']
          )}>
          {this.renderActions()}
        </div>
      </div>
    );
  }
}

export default SidebarCollection;
