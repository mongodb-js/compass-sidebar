import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import styles from './sidebar-database.less';

import { TOOLTIP_IDS } from 'constants/sidebar-constants';
import SidebarCollection from 'components/sidebar-collection';

class SidebarDatabase extends PureComponent {
  static displayName = 'SidebarDatabase';
  static propTypes = {
    _id: PropTypes.string.isRequired,
    activeNamespace: PropTypes.string.isRequired,
    collections: PropTypes.array.isRequired,
    expanded: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isWritable: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    dropCollection: PropTypes.func.isRequired,
    createCollection: PropTypes.func.isRequired,
    openCollection: PropTypes.func.isRequired,
    openDatabase: PropTypes.func.isRequired,
    dropDatabase: PropTypes.func.isRequired,
    modifyView: PropTypes.func.isRequired,
    dropView: PropTypes.func.isRequired
  };

  getCollectionComponents() {
    if (this.props.expanded) {
      return this.props.collections.map((c) => {
        const props = {
          _id: c._id,
          database: c.database,
          capped: c.capped,
          power_of_two: c.power_of_two,
          readonly: c.readonly,
          view_on: c.view_on,
          pipeline: c.pipeline,
          type: c.type,
          activeNamespace: this.props.activeNamespace,
          isWritable: this.props.isWritable,
          description: this.props.description,
          dropCollection: this.props.dropCollection,
          openCollection: this.props.openCollection,
          dropView: this.props.dropView,
          modifyView: this.props.modifyView
        };
        return <SidebarCollection key={c._id} {...props} />;
      });
    }
  }

  getArrowIconClasses() {
    const expanded = this.props.expanded ? 'fa fa-rotate-90' : '';
    return classnames(
      'mms-icon-right-arrow',
      styles['compass-sidebar-icon'],
      styles['compass-sidebar-icon-expand'],
      expanded
    );
  }

  handleOpenDatabaseClick = () => {
    this.props.openDatabase(this.props._id);
  };

  handleArrowClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props._id);
    }
  };

  handleCreateCollectionClick = () => {
    if (this.props.isWritable) {
      this.props.createCollection(this.props._id);
    }
  };

  handleDropDatabaseClick = () => {
    if (this.props.isWritable) {
      this.props.dropDatabase(this.props._id);
    }
  };

  isReadonlyDistro() {
    return process.env.HADRON_READONLY === 'true';
  }

  renderCreateCollectionButton() {
    if (!this.isReadonlyDistro()) {
      const createTooltipText = this.props.isWritable
        ? 'Create collection'
        : this.props.description;
      const createTooltipOptions = {
        'data-for': TOOLTIP_IDS.CREATE_COLLECTION,
        'data-effect': 'solid',
        'data-offset': "{'bottom': 10, 'left': -8}",
        'data-tip': createTooltipText
      };
      const disabled = !this.props.isWritable
        ? styles['compass-sidebar-icon-is-disabled']
        : '';
      const createClassName = classnames(
        'mms-icon-add-circle',
        styles['compass-sidebar-icon'],
        styles['compass-sidebar-icon-create-collection'],
        disabled
      );
      return (
        <i
          className={createClassName}
          onClick={this.handleCreateCollectionClick}
          {...createTooltipOptions}
        />
      );
    }
  }

  renderDropDatabaseButton() {
    if (!this.isReadonlyDistro()) {
      const dropTooltipText = this.props.isWritable
        ? 'Drop database'
        : 'Drop database is not available on a secondary node'; // TODO: Arbiter/recovering/etc
      const dropTooltipOptions = {
        'data-for': TOOLTIP_IDS.DROP_DATABASE,
        'data-effect': 'solid',
        'data-offset': "{'bottom': 10, 'left': -5}",
        'data-tip': dropTooltipText
      };
      const disabled = !this.props.isWritable
        ? styles['compass-sidebar-icon-is-disabled']
        : '';
      const dropClassName = classnames(
        styles['compass-sidebar-icon'],
        styles['compass-sidebar-icon-drop-database'],
        'fa fa-trash-o',
        disabled
      );
      return (
        <i
          className={dropClassName}
          onClick={this.handleDropDatabaseClick}
          {...dropTooltipOptions}
        />
      );
    }
  }

  render() {
    const active =
      this.props.activeNamespace === this.props._id
        ? styles['compass-sidebar-item-header-is-active']
        : '';
    const headerClassName = classnames(
      styles['compass-sidebar-item-header'],
      styles['compass-sidebar-item-header-is-expandable'],
      styles['compass-sidebar-item-header-is-actionable'],
      active
    );
    return (
      <div
        className={classnames(
          styles['compass-sidebar-item'],
          styles['compass-sidebar-item-is-top-level']
        )}
        style={this.props.style}>
        <div className={headerClassName}>
          <div
            className={classnames(
              styles['compass-sidebar-item-header-actions'],
              styles['compass-sidebar-item-header-actions-expand']
            )}>
            <i
              onClick={this.handleArrowClick}
              className={this.getArrowIconClasses()}
            />
          </div>
          <div
            onClick={this.handleOpenDatabaseClick}
            className={styles['compass-sidebar-item-header-title']}
            title={this.props._id}
            data-test-id="sidebar-database">
            {this.props._id}
          </div>
          <div
            className={classnames(
              styles['compass-sidebar-item-header-actions'],
              styles['compass-sidebar-item-header-actions-ddl']
            )}>
            {this.renderCreateCollectionButton()}
            {this.renderDropDatabaseButton()}
          </div>
        </div>
        <div className={styles['compass-sidebar-item-content']}>
          {this.getCollectionComponents.call(this)}
        </div>
      </div>
    );
  }
}

export default SidebarDatabase;
