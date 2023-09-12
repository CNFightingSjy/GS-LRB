import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { CGI_BASE_URL, CGI_DEFAULT_REQUEST_TIMEOUT  } from "@/api/config";

const cgiRequestor: AxiosInstance = axios.create({
    baseURL: CGI_BASE_URL,
    timeout: CGI_DEFAULT_REQUEST_TIMEOUT
});

function handleError(response: AxiosResponse) {
    switch (response.status) {
        case 400:
            // TODO
            break;
        case 401:
            // TODO
            break;
        case 404:
            // TODO
            break;
        // ...
        default:
            const { status, data, statusText } = response;
            throw new Error(`Unknown Request Error ${status} ${statusText} ${data}`);
    }
}

function handleSuccess(response: AxiosResponse) {
    switch (response.status) {
        case 200:
            //
            return response.data;
        // ....
        default:
            return;
    }
}

cgiRequestor.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

cgiRequestor.interceptors.response.use(
    (response: AxiosResponse) => {
        handleSuccess(response);
    },
    (err) => {
        handleError(err);
    }
);

export default cgiRequestor;