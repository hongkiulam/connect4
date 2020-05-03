// Initializes the `moves` service on path `/moves`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Moves } from './moves.class';
import hooks from './moves.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'moves': Moves & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/moves', new Moves(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('moves');

  service.hooks(hooks);
}
