import React from 'react';
import { MapAppHeader } from '../MapAppHeader';
import { testSnapshot } from '../../../../../tests/utils/RenderingHelpers';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('MapAppHeader snapshot tests', () => {
    it('should match the snapshot before the user is logged in', () => {
        mockMapAppState({ loggedInUser: null });

        testSnapshot(<MapAppHeader />);
    });

    it('should match the snapshot when the user is logged in', () => {
        mockMapAppState({ loggedInUser: { id: 'i am logged in', points: 0 } });

        testSnapshot(<MapAppHeader />);
    });
});
