import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { testSnapshot } from '../../../../../../tests/utils/RenderingHelpers';
import { ExtraItem } from '../ExtraItem';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('Extra Item snapshot tests', () => {
    it('should show only the create account or login button', () => {
        mockMapAppState({
            loggedInUser: null,
            isDeviceCreationOngoing: false,
        });

        testSnapshot(<ExtraItem />);
    });

    it('should show only the create device item', () => {
        mockMapAppState({
            loggedInUser: { id: 'i am logged in', points: 0 },
            isDeviceCreationOngoing: false,
        });

        testSnapshot(<ExtraItem />);
    });

    it('should show the temporary item and the create device item', () => {
        mockMapAppState({
            loggedInUser: { id: 'i am logged in', points: 0 },
            isDeviceCreationOngoing: true,
        });

        testSnapshot(<ExtraItem />);
    });
});
