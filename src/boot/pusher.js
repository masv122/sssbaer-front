import { boot } from "quasar/wrappers";

import Echo from "laravel-echo";

const apiEvents = new Object();

apiEvents.Pusher = require("pusher-js");

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
});
apiEvents.Echo = new Echo({
  broadcaster: "pusher",
  key: "ASDASD2121",
  wsHost: window.location.hostname,
  wsPort: 6001,
  disableStats: true,
  forceTLS: false,
});

export { apiEvents };
