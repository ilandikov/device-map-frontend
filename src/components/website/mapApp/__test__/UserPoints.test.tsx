import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { testSnapshot } from '../../../../../tests/utils/RenderingHelpers';
import { UserPoints } from '../UserPoints';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('UserPoints snapshot tests', () => {
    it('should match the snapshot while waiting for user points', () => {
        mockMapAppState({
            loggedInUser: { id: 'i am logged in but waiting for points', points: null },
        });

        testSnapshot(<UserPoints />);
    });

    it('should match the snapshot after getting the user points', () => {
        mockMapAppState({
            loggedInUser: { id: 'i am logged in but waiting for points', points: 320 },
        });

        testSnapshot(<UserPoints />);
    });
});
