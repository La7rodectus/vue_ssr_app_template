import createApp from './app';

export default function () {
  const { app } = createApp({
    /* ... */
  });

  return {
    app,
  };
}
