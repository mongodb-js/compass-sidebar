import React from 'react';
import { mount } from 'enzyme';

import classnames from 'classnames';
import styles from './sidebar-database.less';
import SidebarDatabase from 'components/sidebar-database';
import SidebarCollection from 'components/sidebar-collection';

const DEFAULT_COLLECTIONS = [
  {'_id': 'admin.citibikecoll', 'database': 'admin', 'capped': false, 'power_of_two': false, 'readonly': false},
  {'_id': 'admin.coll', 'database': 'admin', 'capped': false, 'power_of_two': false, 'readonly': false}
];

describe('SidebarDatabase [Component]', () => {
  let component;
  let createCollectionSpy;
  let openCollectionSpy;
  let dropCollectionSpy;
  let openDatabaseSpy;
  let dropDatabaseSpy;
  let onClickSpy;

  describe('is not active', () => {
    beforeEach(() => {
      openCollectionSpy = sinon.spy();
      dropCollectionSpy = sinon.spy();
      createCollectionSpy = sinon.spy();
      openDatabaseSpy = sinon.spy();
      dropDatabaseSpy = sinon.spy();

      onClickSpy = sinon.spy();
      component = mount(<SidebarDatabase
        _id="db"
        activeNamespace=""
        collections={DEFAULT_COLLECTIONS}
        expanded={false}
        style={{}}
        onClick={onClickSpy}
        index={0}
        isWritable
        description="description"
        openCollection={openCollectionSpy}
        dropCollection={dropCollectionSpy}
        createCollection={createCollectionSpy}
        openDatabase={openDatabaseSpy}
        dropDatabase={dropDatabaseSpy}
      />);
    });
    afterEach(() => {
      component = null;

      createCollectionSpy = null;
      openCollectionSpy = null;
      dropCollectionSpy = null;
      openDatabaseSpy = null;
      dropDatabaseSpy = null;

      onClickSpy = null;
    });
    it('mounts the root element', () => {
      expect(component.find(`.${classnames(styles['compass-sidebar-item-header'])}`)).to.be.present();
    });
    it('does not register as active', () => {
      expect(component.find(`.${classnames(styles['compass-sidebar-item-header-is-active'])}`)).to.be.not.present();
    });
    it('sets db name', () => {
      expect(component.find('[data-test-id="sidebar-database"]').text()).to.equal('db');
    });
    it('is not expanded', () => {
      expect(component.find(SidebarCollection)).to.be.not.present();
    });
    it('expands on click', () => {
      component.find(`.${classnames(styles['compass-sidebar-icon-expand'])}`).simulate('click');
      expect(onClickSpy.called).to.equal(true);
    });
    it('creates collection', () => {
      component.find(`.${classnames(styles['compass-sidebar-icon-create-collection'])}`).simulate('click');
      expect(createCollectionSpy.called).to.equal(true);
      expect(createCollectionSpy.args[0]).to.deep.equal(['db']);
    });
    it('drops DB', () => {
      component.find(`.${classnames(styles['compass-sidebar-icon-drop-database'])}`).simulate('click');
      expect(dropDatabaseSpy.called).to.equal(true);
      expect(dropDatabaseSpy.args[0]).to.deep.equal(['db']);
    });
  });
  describe('is active', () => {
    beforeEach(() => {
      openCollectionSpy = sinon.spy();
      dropCollectionSpy = sinon.spy();
      createCollectionSpy = sinon.spy();
      openDatabaseSpy = sinon.spy();
      dropDatabaseSpy = sinon.spy();

      onClickSpy = sinon.spy();

      component = mount(<SidebarDatabase
        _id="db"
        activeNamespace="db"
        collections={DEFAULT_COLLECTIONS}
        expanded={false}
        style={{}}
        onClick={onClickSpy}
        index={0}
        isWritable
        description="description"
        openCollection={openCollectionSpy}
        dropCollection={dropCollectionSpy}
        createCollection={createCollectionSpy}
        openDatabase={openDatabaseSpy}
        dropDatabase={dropDatabaseSpy}
      />);
    });
    afterEach(() => {
      component = null;

      createCollectionSpy = null;
      openCollectionSpy = null;
      dropCollectionSpy = null;
      openDatabaseSpy = null;
      dropDatabaseSpy = null;

      onClickSpy = null;
    });
    it('mounts the root element', () => {
      expect(component.find(`.${classnames(styles['compass-sidebar-item-header'])}`)).to.be.present();
    });
    it('does register as active', () => {
      expect(component.find(`.${classnames(styles['compass-sidebar-item-header-is-active'])}`)).to.be.present();
    });
  });
  describe('is not writable', () => {
    beforeEach(() => {
      openCollectionSpy = sinon.spy();
      dropCollectionSpy = sinon.spy();
      createCollectionSpy = sinon.spy();
      openDatabaseSpy = sinon.spy();
      dropDatabaseSpy = sinon.spy();

      onClickSpy = sinon.spy();

      component = mount(<SidebarDatabase
        _id="db"
        activeNamespace=""
        collections={DEFAULT_COLLECTIONS}
        expanded={false}
        style={{}}
        onClick={onClickSpy}
        index={0}
        isWritable={false}
        description="description"
        openCollection={openCollectionSpy}
        dropCollection={dropCollectionSpy}
        createCollection={createCollectionSpy}
        openDatabase={openDatabaseSpy}
        dropDatabase={dropDatabaseSpy}
      />);
    });
    afterEach(() => {
      component = null;

      createCollectionSpy = null;
      openCollectionSpy = null;
      dropCollectionSpy = null;
      openDatabaseSpy = null;
      dropDatabaseSpy = null;

      onClickSpy = null;
    });
    it('mounts the root element', () => {
      expect(component.find(`.${classnames(styles['compass-sidebar-item-header'])}`)).to.be.present();
    });
    it('does not create collection', () => {
      component.find(`.${classnames(styles['compass-sidebar-icon-create-collection'])}`).simulate('click');
      expect(createCollectionSpy.called).to.equal(false);
    });
    it('does not drop DB', () => {
      component.find(`.${classnames(styles['compass-sidebar-icon-drop-database'])}`).simulate('click');
      expect(dropDatabaseSpy.called).to.equal(false);
    });
  });
  describe('is expanded', () => {
    beforeEach(() => {
      openCollectionSpy = sinon.spy();
      dropCollectionSpy = sinon.spy();
      createCollectionSpy = sinon.spy();
      openDatabaseSpy = sinon.spy();
      dropDatabaseSpy = sinon.spy();

      onClickSpy = sinon.spy();
      component = mount(<SidebarDatabase
        _id="db"
        activeNamespace="db"
        collections={DEFAULT_COLLECTIONS}
        expanded
        style={{}}
        onClick={onClickSpy}
        index={0}
        isWritable
        description="description"
        openCollection={openCollectionSpy}
        dropCollection={dropCollectionSpy}
        createCollection={createCollectionSpy}
        openDatabase={openDatabaseSpy}
        dropDatabase={dropDatabaseSpy}
      />);
    });
    afterEach(() => {
      component = null;

      createCollectionSpy = null;
      openCollectionSpy = null;
      dropCollectionSpy = null;
      openDatabaseSpy = null;
      dropDatabaseSpy = null;

      onClickSpy = null;
    });

    it('mounts the root element', () => {
      expect(component.find(`.${classnames(styles['compass-sidebar-item-header'])}`)).to.be.present();
    });
    it('renders the 2 collections', () => {
      expect(component.find(SidebarCollection).children().length).to.equal(2);
    });
  });
});
