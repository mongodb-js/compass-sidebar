import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import toNS from 'mongodb-ns';

import classnames from 'classnames';
import styles from './sidebar-collection.less';

import DropCollectionButton from './drop-collection-button';

import ModifyViewButton from './modify-view-button';

import DropViewButton from './drop-view-button';

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

  isReadonlyDistro() {
    return process.env.HADRON_READONLY === 'true';
  }

  isView() {
    return this.props.readonly === true;
  }

  handleClick = () => {
    this.props.openCollection(
      this.props._id,
      this.props.readonly,
      this.props.view_on
    );
  };

  handleModifyViewClick = () => {
    this.props.modifyView(this.props._id);
  };

  handleDropViewClick = () => {
    this.props.dropView(this.props._id);
  };

  /**
   * Renders an icon next to the collection name for its type.
   * For now, icon only added if `isView()`.
   * @returns {React.DOMElement}
   */
  renderTypeIcon() {
    if (!this.isView()) {
      return null;
    }

    const className = classnames(
      'fa',
      styles['compass-sidebar-item-view-icon']
    );

    return (
      <i
        className={className}
        title="Read-only View"
        aria-hidden="true"
        data-test-id="sidebar-collection-is-readonly"
      />
    );
  }
  renderModifyAction() {
    if (this.isReadonlyDistro() || !this.isView()) {
      return null;
    }
    return (
      <ModifyViewButton
        _id={this.props._id}
        isWritable={this.props.isWritable}
        description={this.props.description}
        modifyView={this.props.modifyView}
      />
    );
  }

  renderDropAction() {
    if (this.isReadonlyDistro()) {
      return null;
    }

    if (this.isView()) {
      return (
        <DropViewButton
          _id={this.props._id}
          isWritable={this.props.isWritable}
          description={this.props.description}
          dropView={this.props.dropView}
        />
      );
    }

    return (
      <DropCollectionButton
        _id={this.props._id}
        isWritable={this.props.isWritable}
        description={this.props.description}
        dropCollection={this.props.dropCollection}
      />
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
          {collectionName}
          {this.renderTypeIcon()}
        </div>
        <div
          className={classnames(
            styles['compass-sidebar-item-actions'],
            styles['compass-sidebar-item-actions-ddl']
          )}>
          {this.renderModifyAction()}
          {this.renderDropAction()}
        </div>
      </div>
    );
  }
}

export default SidebarCollection;
