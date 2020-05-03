import { Service, MemoryServiceOptions } from 'feathers-memory';
import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';

export class Moves extends Service {
  constructor(options: Partial<MemoryServiceOptions>, app: Application) {
    super(options);
  }

  create(data:{move:string},params?:Params){
    const {move}  = data;
    return super.create({move,params});
  }
}
