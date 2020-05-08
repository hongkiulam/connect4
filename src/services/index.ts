import { Application } from '../declarations';
import moves from './moves/moves.service';
import rooms from './rooms/rooms.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(moves);
  app.configure(rooms);
}
