import createApp from './app';

// export default (context) => new Promise((resolve, reject) => {
//   const { app, router, store } = createApp();

//   router.push(context.url);
//   router.isReady()
//     .then(() => {
//       const matchedComponents = router.currentRoute.value.matched;

//       // no matched routes, send back 404
//       if (!matchedComponents.length) {
//         return reject({ code: 404 });
//       }

//       // call `asyncData()` on all matched route components
//       Promise.all(matchedComponents.map((Component) => {
//         if (Component.asyncData) {
//           return Component.asyncData({
//             store,
//             route: router.currentRoute
//           });
//         }
//       })).then(() => {
//       // After all preFetch hooks are resolved, our store is now
//       // filled with the state needed to render the app.
//       // When we attach the state to the context, and the `template` option
//       // is used for the renderer, the state will automatically be
//       // serialized and injected into the HTML as `window.__INITIAL_STATE__`.
//         context.state = store.state;

//         return resolve({ app, router, store });
//       }).catch((err) => console.log(err));

//       return resolve({ app, router, store });
//     });
// });
export default (url) => new Promise((resolve, reject) => {
  const { router, app, store } = createApp();

  // set server-side router's location
  router.push(url);

  router.isReady()
    .then(() => {
      const matchedComponents = router.currentRoute.value.matched;
      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        return reject(new Error('404'));
      }

      // the Promise should resolve to the app instance so it can be rendered
      return resolve({ app, router, store });
    }).catch(() => reject);
});
