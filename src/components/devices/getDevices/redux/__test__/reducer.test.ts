import getDevices from '../reducer';
import { GetServiceActionTypes } from '../action';

describe('getDevices() reducer tests', () => {
  it('should return initial state', () => {
    const initialState = getDevices(undefined, { type: 'UNKNOWN_ACTION' } as any);

    const expectedInitialState = {
      loading: false,
      error: null,
    }
    expect(initialState).toEqual(expectedInitialState);
  });

  it('should add new id as loading without error', () => {
    const stateWithNewId = getDevices(undefined, { type: GetServiceActionTypes.GET_DEVICES_REQUEST, id: '996557189977', acquiring: true})
    expect(stateWithNewId).toEqual({
      id: '996557189977',
      loading: true,
      error: null,
    });
  });
});