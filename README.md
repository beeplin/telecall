# Telecall

Call back-end NodeJS functions directly from front-end. No HTTP API. Perfect typescript Support.

Clone [Telecall Demo](https://github.com/beeplin/telecall-demo) and run it in VS Code. You can see typescript works smoothly across the `www` codebase and the `server` codebase.

For example:

```js
// server/src/foo/update_user.tele.ts: back-end code for express
export default async function updateUser({ nickname }: UserUpdateData) {
  const { res, req } = this
  // ...
  return user as User
}
```

```js
// www/src/components/UserFrom.js: front-end code for webpack, rollup, or vite
import telecall from 'telecall'
import updateUser from '../../../server/src/foo/update_user.tele.ts'

// ...

telecall(updateUser, { nickname: 'new name' }).then((user) => console.log(user))
//       ~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~          ~~~~ <== All automatically typed!!
```

`telecall` now supports the following frameworks:

Front-end

- [x] webpack (including vue-cli, create-react-app, etc.)
- [x] rollup (and vite)

Back-end

- [x] express
- [ ] koa
- [ ] fastify
- [ ] next
- [ ] nuxt
- [ ] nest
- [ ] egg

## Usage

1. Install:

   ```bash
   npm install telecall
   ```

1. Add a `telecall.config.js` file in your project root:

   ```js
   module.exports = (env) => ({
     resourceMatcher: /\.tele\.(js|ts)$/,
     requestEndpoint: 'http://localhost:3000/api/',
     resolverBasePath: './server/src',
   })
   ```

   - `resourceMatcher`:

     Resources that your `import` or `require` in your front-end code base that matches this regexp will be hijacked by Telecall rather than being bundled by Webpack, Rollup or Vite. For example, `/\.tele\.(js|ts)$/` means Telecall handles all imports ending with `.tele.js` or `.tele.ts`. Or `/\/rpc\//` means all imports containing `/rpc/`.

   - `requestEndpoint`:

     Hijacked imports are turned into network requests to this endpoint.

   - `resolverBasePath`:

     At the back-end, Telecall finds the corresponding resolver functions within this base path, runs them, and takes the results back to front-end. Just like you are calling local functions seamlessly.

1. Modify your `webpack.config.js` (or the `webpack` related part in `vue.config.js`, etc.):

   ```js
   const telecall = require('telecall/lib/webpack-rule')

   module.exports = {
     // ...
     module: {
       rules: [
         // ... after your js/ts related rules
         telecall(),
       ],
     },
   }
   ```

   or if you are using Rollup or Vite, modify your `rollup.config.js` or `vite.config.js`:

   ```js
   import telecall from 'telecall/lib/rollup-plugin'

   export default {
     // ...
     plugins: [/* ... after your js/ts related plugins */ telecall()],
   }
   ```

1. Modify your back-end `express` entry file:

   ```js
   import express from 'express'
   import telecall from 'telecall/lib/express-middleware'

   const app = express()
   app.use(express.json())
   app.use(telecall(app)) // <- Here it is!
   // ...
   const port = app.get('port') // <- Telecall gets the port from `telecall.config.js` and put it here
   app.listen(port)
   ```

1. All done. Now you can do this:

   ```js
   // server/src/foo/bar/update-user.tele.ts
   export default async function updateUser(this: Context, { nickname }: UserUpdateData) {
   const { res, req } = this // <- your can access `req` and `res` in `this` if needed
   // ...
   return user as User
   }
   ```

   ```js
   // www/src/components/UserFrom.ts(x)
   import telecall from 'telecall'
   import updateUser from '../../../server/src/foo/bar/update-user.tele.ts'

   // ...

   telecall(updateUser, { nickname: 'new name' }).then((user) => console.log(user))
   //       ~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~          ~~~~ <== All automatically typed!!
   ```
