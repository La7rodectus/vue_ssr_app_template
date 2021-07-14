import createApp from './app';

export default (context) => new Promise((resolve, reject) => {
  const { router, app, store } = createApp();

  // set server-side router's location
  console.log(context.context.url);
  router.push(context.context.url);

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
