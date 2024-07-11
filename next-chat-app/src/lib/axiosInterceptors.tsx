import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// style components
import {
  DEFAULT_TIMEOUT,
  LOCAL_STORAGE_USER_TOKEN,
} from "../constants/defaultValues";

const request: AxiosInstance = axios.create({
  baseURL: process.env.baseUrlApi,
  timeout: DEFAULT_TIMEOUT,
  responseType: "json",
});

request.interceptors.request.use(
  async function (config: any) {
    let token: string | undefined = undefined;

    const urlString = config.url;
    const multipartFormData = config.headers.multipartFormData;
    const regex = /tokenFromServer=([^&]+)/;
    const match = urlString.match(regex);
    if (match) {
      const tokenFromServer = match[1];
      token = tokenFromServer;
    } else {
      token = Cookies.get(LOCAL_STORAGE_USER_TOKEN);
    }

    config.headers["Authorization"] = "Bearer " + token;
    config.headers["Content-Type"] = `${
      multipartFormData || "application/json"
    }`;

    return config;
  },

  async function (error: string) {
    return await Promise.reject(error);
  }
);

export const appendArgsToUrl = (url: string, queryParams: any) => {
  const queryString: any = [];
  Object.keys(queryParams).forEach(function (key) {
    if (queryParams[key] !== null) {
      queryString.push(`${key}=${encodeURIComponent(queryParams[key])}`);
    }
  });
  if (!queryString.length) {
    return url;
  }
  return `${url}?${queryString.join("&")}`;
};

function post(
  url: string,
  data: {},
  config?: AxiosRequestConfig<{}> | undefined
) {
  return request.post(url, data, config);
}
function get(
  url: string,
  parameter: {},
  config?: AxiosRequestConfig<{}> | undefined
) {
  const finalUrl = appendArgsToUrl(url, parameter);
  return request.get(finalUrl, config);
}

function put(
  url: string,
  data: {},
  config?: AxiosRequestConfig<{}> | undefined
) {
  return request.put(url, data, config);
}

function remove(url: string, config?: AxiosRequestConfig<{}> | any) {
  return request.delete(url, config);
}

function patch(
  url: string,
  data: {},
  config?: AxiosRequestConfig<{}> | undefined
) {
  return request.patch(url, data, config);
}

export default Object.freeze({
  get,
  post,
  put,
  remove,
  patch,
});
