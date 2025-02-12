import React from 'react';
import { mockMapAppState } from '../../../../redux/__mocks__/mocks';
import { testSnapshot } from '../../../../../tests/utils/RenderingHelpers';
import { UserPoints } from '../UserPoints';

describe('UserPoints snapshot tests', () => {
    it('should match the snapshot while waiting for user points', () => {
        mockMapAppState({
            loggedInUser: { id: 'i am logged in but waiting for points', points: null },
        });

        testSnapshot(<UserPoints className="map-app-header-block" />);
    });

    it('should match the snapshot after getting the user points', () => {
        mockMapAppState({
            loggedInUser: { id: 'i am logged in but waiting for points', points: 320 },
        });

        testSnapshot(<UserPoints className="map-app-header-block" />);
    });
});
