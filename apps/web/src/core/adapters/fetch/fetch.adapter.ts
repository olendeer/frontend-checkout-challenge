import {
  ApiEnvelope,
  AuthProvider,
  HttpClient,
  HttpError,
  HttpErrorCodes,
  HttpErrorMessage,
  HttpMethods,
  HttpResponse,
  RequestConfig,
  StatusCodes,
} from 'core/http';

export type ErrorMapper = (body: unknown, status: number) => HttpError;

interface FetchAdapterOptions {
  baseUrl: string;
  mapError: ErrorMapper;
}

interface SendOptions extends RequestConfig {
  body?: unknown;
  method: HttpMethods;
}

export class FetchAdapter implements HttpClient {
  private _authProvider: AuthProvider | null = null;

  constructor(private readonly _options: FetchAdapterOptions) {}

  setAuthProvider = (provider: AuthProvider): void => {
    this._authProvider = provider;
  };

  get = <TData>(url: string, config?: RequestConfig): Promise<HttpResponse<TData>> =>
    this._send<TData>(url, { ...config, method: HttpMethods.GET });

  post = <TData, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: RequestConfig,
  ): Promise<HttpResponse<TData>> =>
    this._send<TData>(url, { ...config, body, method: HttpMethods.POST });

  put = <TData, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: RequestConfig,
  ): Promise<HttpResponse<TData>> =>
    this._send<TData>(url, { ...config, body, method: HttpMethods.PUT });

  delete = <TData = void>(url: string, config?: RequestConfig): Promise<HttpResponse<TData>> =>
    this._send<TData>(url, { ...config, method: HttpMethods.DELETE });

  private _send = async <TData>(
    url: string,
    options: SendOptions,
  ): Promise<HttpResponse<TData>> => {
    const response = await this._fetch(url, options);

    if (this._getIsReissueNeeded(response, options)) {
      await this._authProvider?.reissueToken();

      const retried = await this._fetch(url, options);

      return this._toResponse<TData>(retried);
    }

    return this._toResponse<TData>(response);
  };

  private _getIsReissueNeeded = (response: Response, options: SendOptions): boolean => {
    if (options.skipAuth || !this._authProvider) {
      return false;
    }

    return response.status === StatusCodes.UNAUTHORIZED;
  };

  private _fetch = async (url: string, options: SendOptions): Promise<Response> => {
    const headers: Record<string, string> = { Accept: 'application/json', ...options.headers };
    const token = options.skipAuth ? null : (this._authProvider?.getToken() ?? null);

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (options.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(this._toUrl(url, options.query), {
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        cache: 'no-store',
        headers,
        method: options.method,
        signal: options.signal,
      });

      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }

      throw new HttpError(
        HttpErrorMessage.network,
        StatusCodes.NETWORK_ERROR,
        HttpErrorCodes.NETWORK,
      );
    }
  };

  private _toResponse = async <TData>(response: Response): Promise<HttpResponse<TData>> => {
    const body = await this._readBody(response);

    if (!response.ok) {
      throw this._options.mapError(body, response.status);
    }

    const envelope = (body ?? {}) as Partial<ApiEnvelope<TData>>;

    return {
      data: envelope.data as TData,
      links: envelope.links ?? {},
      location: response.headers.get('Location'),
      requestId: envelope.meta?.requestId ?? '',
      retryAfterMs: this._toRetryAfterMs(response.headers.get('Retry-After')),
      status: response.status,
    };
  };

  private _readBody = async (response: Response): Promise<unknown> => {
    if (response.status === StatusCodes.NO_CONTENT) {
      return null;
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  private _toRetryAfterMs = (header: string | null): number | null => {
    if (!header) {
      return null;
    }

    const seconds = Number(header);

    return Number.isFinite(seconds) ? seconds * 1000 : null;
  };

  private _toUrl = (path: string, query?: RequestConfig['query']): string => {
    const url = new URL(path, this._options.baseUrl);

    if (query) {
      Object.entries(query).forEach(([name, value]) => {
        if (value !== undefined) {
          url.searchParams.set(name, String(value));
        }
      });
    }

    return url.toString();
  };
}
