# CNCT 4

## Connect 4 two player game with rooms!

#### Node.js, Express, Socket.IO, Typescript, PWA

Deployed on heroku [here](https://connect-4-server.herokuapp.com)

> Learning websockets and creating rooms was the main goal of this project, and rooms were created by accessing `window.location.pathname` and using that string to create a room with Socket.IO.
> Each room is restricted to 2 players only by simply counting the players in the room before allowing a new player to join.

> The UI is inspired by Minimalista Playing Cards

##### Development

`npm run dev` executes `ts-node` on `server.ts` to run the server locally.

##### Deployment

When deploying to heroku, `npm install` is run on every rebuild. Thus we can run `tsc` on `postinstall` to transpile the Typescript into Javscript on deployment.
