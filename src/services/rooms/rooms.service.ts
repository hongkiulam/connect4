// Initializes the `rooms` service on path `/rooms`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Rooms } from './rooms.class';
import hooks from './rooms.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'rooms': Rooms & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/rooms', new Rooms(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('rooms');

  service.hooks(hooks);
}
