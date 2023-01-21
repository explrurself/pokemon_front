import axios from 'axios';
import { isAuth, authToken } from './AuthHelpers';
const init = () => {
  let w = window;
  let status = false;
  w.axios = require("axios");
  console.log(localStorage.getItem["Authorization"])
  if (isAuth) {
    localStorage.getItem["Authorization"] = authToken;
    status = true;
  } else {
    status = false;
  }
  return status ? "success" : "failed";
};
export default init;
