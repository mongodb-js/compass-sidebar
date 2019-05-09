import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import styles from './sidebar-collection.less';

import { TOOLTIP_IDS } from 'constants/sidebar-constants';

class ModifyViewButton extends PureComponent {
  static displayName = 'SidebarModifyViewButton';
  static propTypes = {
    _id: PropTypes.string.isRequired,
    isWritable: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    modifyView: PropTypes.func.isRequired
  };

  handleClick = () => {
    if (this.props.isWritable) {
      this.props.modifyView(this.props._id);
    }
  };

  render() {
    const tooltipText = this.props.isWritable
      ? 'Modify view'
      : this.props.description;

    const tooltipProps = {
      'data-for': TOOLTIP_IDS.MODIFY_VIEW,
      'data-effect': 'solid',
      'data-offset': "{'bottom': 10, 'left': -5}",
      'data-tip': tooltipText
    };

    const disabled = !this.props.isWritable
      ? styles['compass-sidebar-icon-is-disabled']
      : '';

    const dropClassName = classnames(
      styles['compass-sidebar-icon'],
      styles['compass-sidebar-icon-modify-view'],
      'fa',
      'fa-trash-o',
      disabled
    );

    return (
      <i
        className={dropClassName}
        data-test-id="compass-sidebar-icon-modify-view"
        onClick={this.handleDropCollectionClick}
        {...tooltipProps}
      />
    );
  }
}

export default ModifyViewButton;
