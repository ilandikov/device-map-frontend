import React from 'react';
import { mockMapAppState } from '../../../../redux/__mocks__/mocks';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { UserPoints } from '../UserPoints';

describe('UserPoints snapshot tests', () => {
    it('should match the snapshot while waiting for user points', () => {
        mockMapAppState({ currentUserPoints: null });
        const component = renderForSnapshotTest(<UserPoints className="map-app-header-block" />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot after getting the user points', () => {
        mockMapAppState({ currentUserPoints: 320 });
        const component = renderForSnapshotTest(<UserPoints className="map-app-header-block" />);

        expect(component).toMatchSnapshot();
    });
});
