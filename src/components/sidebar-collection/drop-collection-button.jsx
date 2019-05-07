import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
// import styles from './sidebar-collection.less';
const styles = {};

import { TOOLTIP_IDS } from 'constants/sidebar-constants';

class DropCollectionButton extends PureComponent {
  static displayName = 'SidebarDropCollectionButton';
  static propTypes = {
    _id: PropTypes.string.isRequired,
    isWritable: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    dropCollection: PropTypes.func.isRequired
  };

  handleDropCollectionClick = () => {
    if (this.props.isWritable) {
      this.props.dropCollection(this.props._id);
    }
  };

  render() {
    const tooltipText = this.props.isWritable
      ? 'Drop collection'
      : this.props.description;

    const tooltipProps = {
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
        {...tooltipProps}
      />
    );
  }
}

export default DropCollectionButton;
