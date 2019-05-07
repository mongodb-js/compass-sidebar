import React from 'react';
import { mount } from 'enzyme';

import classnames from 'classnames';
import styles from './sidebar-collection.less';
import SidebarCollection from 'components/sidebar-collection';

describe('SidebarCollection [Component]', () => {
  let component;
  let openCollectionSpy;
  let dropCollectionSpy;
  let dropViewSpy;
  let modifyViewSpy;

  describe('is not active', () => {
    beforeEach(() => {
      openCollectionSpy = sinon.spy();
      dropCollectionSpy = sinon.spy();
      dropViewSpy = sinon.spy();
      modifyViewSpy = sinon.spy();

      component = mount(
        <SidebarCollection
          _id="db.coll"
          database="db"
          capped={false}
          power_of_two={false}
          readonly={false}
          isWritable
          description="description"
          activeNamespace=""
          openCollection={openCollectionSpy}
          dropCollection={dropCollectionSpy}
          dropView={dropViewSpy}
          modifyView={modifyViewSpy}
        />
      );
    });
    afterEach(() => {
      component = null;
      openCollectionSpy = null;
      dropCollectionSpy = null;
      dropViewSpy = null;
      modifyViewSpy = null;
    });
    it('mounts the root element', () => {
      expect(
        component.find(`.${classnames(styles['compass-sidebar-item'])}`)
      ).to.be.present();
    });
    it('does not register as active', () => {
      expect(
        component.find(
          `.${classnames(styles['compass-sidebar-item-is-active'])}`
        )
      ).to.be.not.present();
    });
    it('sets collection name', () => {
      expect(
        component.find('[data-test-id="sidebar-collection"]').text()
      ).to.equal('coll');
    });
    it('does not register as readonly', () => {
      expect(
        component.find('[data-test-id="sidebar-collection-is-readonly"]')
      ).to.be.not.present();
    });
    it('triggers drop collection when clicked', () => {
      component
        .find('[data-test-id="compass-sidebar-icon-drop-collection"]')
        .simulate('click');
      expect(dropCollectionSpy.called).to.equal(true);
      expect(dropCollectionSpy.args[0]).to.deep.equal(['db.coll']);
    });
  });
  describe('is active', () => {
    beforeEach(() => {
      openCollectionSpy = sinon.spy();
      dropCollectionSpy = sinon.spy();
      dropViewSpy = sinon.spy();
      modifyViewSpy = sinon.spy();

      component = mount(
        <SidebarCollection
          _id="db.coll"
          database="db"
          capped={false}
          power_of_two={false}
          readonly={false}
          isWritable
          description="description"
          activeNamespace="db.coll"
          openCollection={openCollectionSpy}
          dropCollection={dropCollectionSpy}
          dropView={dropViewSpy}
          modifyView={modifyViewSpy}
        />
      );
    });
    afterEach(() => {
      component = null;
      openCollectionSpy = null;
      dropCollectionSpy = null;
      dropViewSpy = null;
      modifyViewSpy = null;
    });
    it('registers as active', () => {
      expect(
        component.find(
          `.${classnames(styles['compass-sidebar-item-is-active'])}`
        )
      ).to.be.present();
    });
    it('sets collection name', () => {
      expect(
        component.find('[data-test-id="sidebar-collection"]').text()
      ).to.equal('coll');
    });
  });
  describe('Views', () => {
    beforeEach(() => {
      openCollectionSpy = sinon.spy();
      dropCollectionSpy = sinon.spy();
      dropViewSpy = sinon.spy();
      modifyViewSpy = sinon.spy();

      component = mount(
        <SidebarCollection
          _id="echo.albums"
          database="echo"
          capped={false}
          power_of_two={false}
          type="view"
          pipeline={[
            { $unwind: '$albums' },
            { $project: { artist: '$name', title: '$albums.name' } }
          ]}
          view_on="artists"
          readonly
          isWritable
          description="description"
          activeNamespace="echo.albums"
          openCollection={openCollectionSpy}
          dropCollection={dropCollectionSpy}
          dropView={dropViewSpy}
          modifyView={modifyViewSpy}
        />
      );
    });
    afterEach(() => {
      component = null;
      openCollectionSpy = null;
      dropCollectionSpy = null;
      dropViewSpy = null;
      modifyViewSpy = null;
    });
    it('sets collection name', () => {
      expect(
        component.find('[data-test-id="sidebar-collection"]').text()
      ).to.equal('albums');
    });
    it('registers as readonly', () => {
      expect(
        component.find('[data-test-id="sidebar-collection-is-readonly"]')
      ).to.be.present();
    });
    it('has the view icon', () => {
      expect(
        component.find(`.${styles['compass-sidebar-item-view-icon']}`)
      ).to.be.present();
    });
    it('triggers drop view when clicked', () => {
      component
        .find('[data-test-id="compass-sidebar-item-actions-ddl-view-drop"]')
        .at(1)
        .simulate('click');
      expect(dropViewSpy.called).to.equal(true);
      expect(dropViewSpy.args[0]).to.deep.equal(['echo.albums']);
    });

    it('triggers modify view when clicked', () => {
      component
        .find('[data-test-id="compass-sidebar-item-actions-ddl-view-modify"]')
        .at(1)
        .simulate('click');
      expect(modifyViewSpy.called).to.equal(true);
      expect(modifyViewSpy.args[0]).to.deep.equal(['echo.albums']);
    });
  });
});
