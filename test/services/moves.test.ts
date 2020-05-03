import app from '../../src/app';

describe('\'moves\' service', () => {
  it('registered the service', () => {
    const service = app.service('moves');
    expect(service).toBeTruthy();
  });
});
