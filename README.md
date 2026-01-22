# Device Map Developed with Test-Driven Development (Frontend)

A proof-of-concept web application demonstrating advanced testing methodologies and reactive architecture patterns. Built as a device tracking system with real-time updates, this project showcases my transition from embedded programming to modern web development with emphasis on test-driven development and architectural excellence. Every line of code was written with testing in mind, using a test-first approach that ensures reliability and maintainability. The architecture prioritizes testability through dependency injection, type safety, and clear separation of concerns.

The backend is available at <https://github.com/ilandikov/device-map-backend>

## Overview

The application serves as a proof-of-concept for building collaborative mapping systems with real-time updates and community-driven content verification:

- **Any user**: Can view all devices on the map
- **Authenticated User**: Can create devices by clicking on a map, approve others' devices (only once), and delete their own creations
- **Gamification**:
  - Users earn points for approving devices
  - Users earn points creating a device when that device becomes approved by 2 other users
- **Real-time Updates**: The application provides live updates when new devices are created or existing ones are approved

## Technology Stack

React, Gatsby, Redux, RxJS, GraphQL, TypeScript, Jest, Approval Testing, AWS Cognito, Leaflet

## Testing Methodology

### Comprehensive Test Coverage

The project demonstrates a multi-layered testing approach that ensures reliability at every level:

- **React vs Redux State**: Snapshot tests against Redux state
- **React vs Redux Actions**: Mocks to validate UI interactions
- **Redux State Transitions**: Custom helper Redux testers
- **RxJS**: RxJS epics tested with dependency injection
- **Test Infrastructure**: Custom utilities including rendering helpers, mock factories, state builders, and action testers

### Advanced Testing Patterns

#### State-Driven Component Testing

Components are tested against various authentication states using parameterized scenarios that prioritize human readability. The test structure makes it immediately clear what conditions are being tested:

From [src/components/website/login/\_\_test\_\_/LogInForm.test.tsx](https://github.com/ilandikov/device-map-frontend/blob/master/src/components/website/login/__test__/LogInForm.test.tsx):

```typescript
describe('LogInForm snapshot test', () => {
  it.each([
    {
      name: 'should be verified without error',
      authenticationState: { email: 'verify@me.uk', password: 'password1' },
    },
    {
      name: 'should be verified when error is present',
      authenticationState: { error: new Error('somethingIsWrong') },
    },
  ])('$name', ({ authenticationState }) => {
    verifyComponentAtAuthenticationState(authenticationState, <LogInForm />);
  });
});
```

#### Action Dispatch Testing

User interactions are validated by testing the exact Redux actions dispatched. The tests use parameterized scenarios to cover different user interactions:

From [src/components/website/login/\_\_test\_\_/LogInForm.test.tsx](https://github.com/ilandikov/device-map-frontend/blob/master/src/components/website/login/__test__/LogInForm.test.tsx)

```typescript
it.each([
  {
    name: 'should update the user email on input on password input stage',
    authenticationState: { step: AuthenticationStep.LOGIN },
    userAction: () => type(<LogInForm />, 'emailInput', 'hereIsMyMail@server.com'),
    dispatched: loginModalInput(LoginModalInputType.EMAIL, 'hereIsMyMail@server.com'),
  },
  {
    name: 'should call user authentication when next button is pressed',
    authenticationState: {},
    userAction: () => click(<LogInForm />, 'nextButton'),
    dispatched: loginModalRemoteRequest(LoginModalCheck.NONE),
  },
])('$name', ({ authenticationState, userAction, dispatched }) => {
  mockAuthenticationState(authenticationState);
  userAction();
  testDispatchedAction(dispatched);
});
```

#### Custom Epic Testing Framework

The testing framework creates highly readable tests that read like natural language. Here's how it's used in practice for testing device operations:

From [src/components/website/mapApp/redux/\_\_test\_\_/devices.test.ts](https://github.com/ilandikov/device-map-frontend/blob/master/src/components/website/mapApp/redux/__test__/devices.test.ts):

```typescript
itShouldAnswerBy('sending LIST_DEVICES', {
  epic: devices,
  remoteClients: { devicesClient: resolvingDevicesClient },
  sentAction: deviceListRequest(),
  expectedActions: [devicesListed(mockDeviceList)],
});
```

The framework achieves this readability through a custom helper that handles dependency injection and asynchronous stream testing:

From [src/redux/\_\_test\_\_/helpers.ts](https://github.com/ilandikov/device-map-frontend/blob/master/src/redux/__test__/helpers.ts)

```typescript
export function itShouldAnswerBy(testName: string, scenario: EpicTest) {
  it(testName, async () => {
    const output$ = scenario.epic(of(scenario.sentAction), buildTestStateObservable(...));
    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(scenario.expectedActions);
  });
}
```

## Architecture Strengths

### Dependency Injection with RxJS

The architecture uses dependency injection patterns for testability. This allows easy mocking of clients in tests:

From [src/redux/store.ts](https://github.com/ilandikov/device-map-frontend/blob/master/src/redux/store.ts):

```typescript
const epicMiddleware: RootMiddleWare = createEpicMiddleware({
  dependencies: {
    cognitoClient: new CognitoClient({ /* live client */ }),
    devicesClient: { /* live client */ },
    addressClient: { /* live client */ },
    usersClient: { /* live client */ },
  },
});
```

Testing clients are easily injected, enabling comprehensive test coverage:

From [src/components/website/mapApp/redux/\_\_test\_\_/devicesTestHelpers.ts](https://github.com/ilandikov/device-map-frontend/blob/master/src/components/website/mapApp/redux/__test__/devicesTestHelpers.ts):

```typescript
export const resolvingDevicesClient: DevicesClient = {
  forAnonymousUser: {
    listDevices: () => Promise.resolve({
      devices: [
        { id: 'dev1', location: { lat: 42.8, lon: 74.6 }, approvals: 6 },
        { id: 'dev2', location: { lat: 43.0, lon: 75.0 }, approvals: 3 },
      ],
      count: 2,
    }),
  },
  forAuthenticatedUser: {
    createDevice: () => Promise.resolve({ id: 'testId' }),
    deleteDevice: (input) => Promise.resolve({ id: input.id }),
    // Other methods...
  },
};
```

### Type-Safe Client Abstractions

Created strongly-typed client interfaces that separate business logic from implementation. The `T22...` GraphQL types are imported from a generated schema via a custom import script (Details in my [article](https://ilyas.life/prog/2024/11/04/automated-and-versioned)), ensuring complete type safety between frontend and backend:

From [src/redux/store.ts](https://github.com/ilandikov/device-map-frontend/blob/master/src/redux/store.ts):

```typescript
export interface DevicesClient {
  forAnonymousUser: {
    listDevices: () => Promise<T22ListDevicesResponse>;
  };
  forAuthenticatedUser: {
    createDevice: (input: T22CreateDeviceRequestInput) => Promise<T22CreateDeviceRequestResponse>;
    deleteDevice: (input: T22DeleteDeviceRequestInput) => Promise<T22DeleteDeviceRequestInput>;
    approveDevice: (input: T22ApproveDeviceRequestInput) => Promise<T22ApproveDeviceRequestResponse>;
    subscribeForCreation: (creatorID: string) => (subscriber: Subscriber<T22Device>) => void;
  };
}
```

### Request-Response Pattern with RxJS

Implemented a clean request-response pattern for handling asynchronous operations. This abstraction centralizes request logic, making the epic more declarative and easier to test by separating the "what" (request configuration) from the "how" (execution logic):

From [src/components/website/mapApp/redux/devices.ts](https://github.com/ilandikov/device-map-frontend/blob/master/src/components/website/mapApp/redux/devices.ts):

```typescript
type DevicesRequest<TResponse, TRequestAction> = {
  call: (client: DevicesClient, state: MapAppState, action: TRequestAction) => Promise<TResponse>;
  responseToAction: (response: TResponse) => Observable<MapAppAction>;
};

const devicesRequests: {
  [key in DeviceRemoteRequestType]: DevicesRequest<DeviceRemoteResponse, DeviceRemoteRequest>;
} = {
  LIST_DEVICES: listDevicesRequest,
  CREATE_DEVICE_REQUEST: createDeviceRequest,
  DELETE_DEVICE: deleteDeviceRequest,
  APPROVE_DEVICE: approveDevice,
};
```
