import renderer from 'react-test-renderer';
import React from 'react';
import { Provider } from 'react-redux';
import MapApp from '../MapApp';
import { configureTestStore } from '../../../../../tests/utils';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../redux/__mocks__/MapAppState';
import { MapAppUsageStep } from '../MapAppReducer';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('MapApp snapshot tests', () => {
    it('should match the snapshot', () => {
        mockMapAppState({ usageStep: MapAppUsageStep.HOMESCREEN, showProductDescription: true, showLoginModal: false });
        const mapAppWithTestStore = (
            <Provider store={configureTestStore()}>
                <MapApp />
            </Provider>
        );
        const component = renderer.create(mapAppWithTestStore).toJSON();

        expect(component).toMatchSnapshot();
    });
});
