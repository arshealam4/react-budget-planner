import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/budget";

export function getBudgets() {
  return http.get(`${apiEndpoint}/get-list`);
}

export function getBudget(id) {
  return http.get(`${apiEndpoint}/get/${id}`);
}

export function saveBudget(budget) {
  if (budget._id) {
    const body = { ...budget };
    delete body._id;
    return http.put(`${apiEndpoint}/edit/${budget._id}`, body);
  }

  return http.post(`${apiEndpoint}/add`, budget);
}

export function deleteBudget(id) {
  return http.delete(`${apiEndpoint}/delete/${id}`);
}
