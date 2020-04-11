import axios from "axios";
import { toast } from "react-toastify";

// axios is third Promise based HTTP client for the browser and node.js

/* interceptors to catch unhandle error,
 like no internet connection, server dowm,
 db down and show proper message 
*/
axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error("An unexpected error occurrred.");
  }

  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
