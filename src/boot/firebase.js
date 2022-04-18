import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import { boot } from "quasar/wrappers";
const firebaseConfig = {
  apiKey: "AIzaSyDMKAxUls2UgS6s7jhE_K3o05CZ8oInO-c",
  authDomain: "pasantia-50dc4.firebaseapp.com",
  databaseURL: "https://pasantia-50dc4-default-rtdb.firebaseio.com",
  projectId: "pasantia-50dc4",
  storageBucket: "pasantia-50dc4.appspot.com",
  messagingSenderId: "1095081559879",
  appId: "1:1095081559879:web:df96b1d6f3370c1d7aee62",
};
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const db = getDatabase(app);

export default boot(({ app }) => {
  app.config.globalProperties.$db = db;
});

export { db };
