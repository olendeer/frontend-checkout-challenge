export enum HttpMethods {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

export enum StatusCodes {
  NETWORK_ERROR = 0,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export enum HttpErrorCodes {
  NETWORK = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

export interface ApiLink {
  href: string;
  method: `${HttpMethods}`;
}

export type ApiLinks = Record<string, ApiLink>;

export interface ApiEnvelope<TData> {
  data: TData;
  links: ApiLinks;
  meta: { requestId: string };
}

export interface RequestConfig {
  headers?: Record<string, string>;
  idempotencyKey?: string;
  query?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
  skipAuth?: boolean;
}

export interface HttpResponse<TData> {
  data: TData;
  links: ApiLinks;
  location: string | null;
  requestId: string;
  retryAfterMs: number | null;
  status: number;
}

export enum HttpErrorMessage {
  network = 'Не удалось связаться с сервером. Проверьте соединение и повторите.',
  unknown = 'Что-то пошло не так. Повторите попытку.',
}
