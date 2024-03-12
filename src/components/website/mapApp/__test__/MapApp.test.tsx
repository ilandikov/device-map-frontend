import renderer from 'react-test-renderer';
import React from 'react';
import { Provider } from 'react-redux';
import MapApp from '../MapApp';
import { configureTestStore } from '../../../../../tests/utils';

describe('MapApp snapshot tests', () => {
    it('should match the snapshot', () => {
        const mapAppWithTestStore = (
            <Provider store={configureTestStore()}>
                <MapApp />
            </Provider>
        );
        const component = renderer.create(mapAppWithTestStore).toJSON();

        expect(component).toMatchSnapshot();
    });
});
