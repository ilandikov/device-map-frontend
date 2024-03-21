import { lastValueFrom, of } from 'rxjs';
import { signUpEpic } from '../epic';

describe('sign up epic tests', () => {
    it('should return the sent action', async () => {
        const sentAction = { field: 'ping', anotherField: 'pong' };

        const state$ = signUpEpic(of(sentAction));
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ field: 'ping', anotherField: 'pong' });
    });
});
