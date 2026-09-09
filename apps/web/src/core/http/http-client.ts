import { HttpResponse, RequestConfig } from './http.types';

export interface AuthProvider {
  getToken: () => string | null;
  reissueToken: () => Promise<string | null>;
}

export interface HttpClient {
  delete: <TData = void>(url: string, config?: RequestConfig) => Promise<HttpResponse<TData>>;
  get: <TData>(url: string, config?: RequestConfig) => Promise<HttpResponse<TData>>;
  post: <TData, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: RequestConfig,
  ) => Promise<HttpResponse<TData>>;
  put: <TData, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: RequestConfig,
  ) => Promise<HttpResponse<TData>>;
}
