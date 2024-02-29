import renderer from 'react-test-renderer';
import React from 'react';
import MapApp from '../MapApp';

describe('MapApp snapshot tests', () => {
    it('should match the snapshot', () => {
        const component = renderer.create(<MapApp />).toJSON();

        expect(component).toMatchSnapshot();
    });
});
