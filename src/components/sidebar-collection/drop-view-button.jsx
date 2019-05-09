import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import styles from './sidebar-collection.less';

import { TOOLTIP_IDS } from 'constants/sidebar-constants';

class DropViewButton extends PureComponent {
  static displayName = 'SidebarDropViewButton';
  static propTypes = {
    _id: PropTypes.string.isRequired,
    isWritable: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    dropView: PropTypes.func.isRequired
  };

  handleDropViewClick = () => {
    if (this.props.isWritable) {
      this.props.dropView(this.props._id);
    }
  };

  render() {
    const tooltipText = this.props.isWritable
      ? 'Drop view'
      : this.props.description;

    const tooltipProps = {
      'data-for': TOOLTIP_IDS.DROP_VIEW,
      'data-effect': 'solid',
      'data-offset': "{'bottom': 10, 'left': -5}",
      'data-tip': tooltipText
    };

    const disabled = !this.props.isWritable
      ? styles['compass-sidebar-icon-is-disabled']
      : '';

    const dropClassName = classnames(
      styles['compass-sidebar-icon'],
      styles['compass-sidebar-icon-drop-view'],
      'fa',
      'fa-trash-o',
      disabled
    );

    return (
      <i
        className={dropClassName}
        data-test-id="compass-sidebar-icon-drop-view"
        onClick={this.handleDropViewClick}
        {...tooltipProps}
      />
    );
  }
}

export default DropViewButton;
