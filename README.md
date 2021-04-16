# Telecall

Call back-end NodeJS functions directly from front-end. No HTTP API. Perfect typescript Support.

Clone [Telecall Demo](https://github.com/beeplin/telecall-demo) and run it in VS Code. You can see typescript works smoothly across the `www` codebase and the `server` codebase.

## Example

```js
// server/src/foo/update_user.tele.ts: back-end code for express

// NOTE: This is the back-end function you are about to import from front-end
export default async function updateUser({ req, res }: Context, { name }: UserUpdateData) {
  // ...
  return user as User
}
```

```js
// somewhere in your front-end code
import telecall from 'telecall'

// NOTE: import the back-end function directly
import updateUser from '../../../server/src/foo/update_user.tele.ts'

// ...

telecall(updateUser, { name: 'beep' }).then((user) => console.log(user))
//       ~~~~~~~~~~  ~~~~~~~~~~~~~~          ~~~~ <== parameters and result automatically typed!!
```

## Supported frameworks

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
   app.use(express.json()) // NOTE: use express.json() before telecall(app)
   app.use(telecall(app)) // <- Here it is!
   // ...
   const port = app.get('port') // <- Telecall reads port from `telecall.config.js` and put it here
   app.listen(port)
   ```

1. All done. Now you can do this:

   ```js
   // server/src/foo/bar/update-user.tele.ts
   export default async function updateUser({ res, req }: Context, { name }: UserUpdateData) {
   // ...
   return user as User
   }
   ```

   ```js
   // www/src/components/SomeComponent.ts(x)
   import telecall from 'telecall'
   import updateUser from '../../../server/src/foo/bar/update-user.tele.ts'

   // ...

   telecall(updateUser, { name: 'beep' }).then((user) => console.log(user))
   //       ~~~~~~~~~~  ~~~~~~~~~~~~~~          ~~~~ <== All automatically typed!!
   ```

## Express Middleware Options

To add more headers for the response, pass `extraHeaders` to the middleware:

```js
app.use(
  telecall(app, {
    extraHeaders: { for: 'bar' },
  }),
)
```

If your back-end is written in typescript and will be compiled and run as javascript in production, your resolver functions would be probably renamed from `*.ts` to `*.js` and moved from `/server/src` to `/server/dist`. In this case, to make sure telecall work on development as well as production, you can pass a `convertResolverPath` function to the middleware:

```js
app.use(
  telecall(app, {
    convertResolverPath: (original) =>
      original.endsWith('.ts')
        ? original.replace(/^src\/(.*?)\.ts$/, 'dist/$1.js')
        : original,
  }),
)
```
