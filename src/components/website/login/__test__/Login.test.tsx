import renderer from 'react-test-renderer';
import React from 'react';
import Login from '../Login';

describe('Login snapshot tests', () => {
    it('should match the snapshot', () => {
        const component = renderer.create(<Login />).toJSON();

        expect(component).toMatchSnapshot();
    });
});
