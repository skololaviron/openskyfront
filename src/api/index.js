import axios from "axios";
import * as API_ENDPOINTS from "./constants";

export function getArrivalFlight(params) {
  return axios.get(API_ENDPOINTS.API_ARRIVAL, { params })
    .then(resp => resp.data)
    .catch(e => console.log("can't get Arrival"));
}

export function getDepartureFlight(params) {
  return axios.get(API_ENDPOINTS.API_DEPARTURE, { params })
    .then(resp => resp.data)
    .catch(e => console.log("can't get Departure"));
}
