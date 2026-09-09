import { StatusCodes } from './http.types';

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    private readonly _fieldsErrors: [string, string][] = [],
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  get hasFieldsErrors(): boolean {
    return this._fieldsErrors.length > 0;
  }

  get isNetworkError(): boolean {
    return this.status === StatusCodes.NETWORK_ERROR;
  }

  get isUnauthorized(): boolean {
    return this.status === StatusCodes.UNAUTHORIZED;
  }

  get isServerError(): boolean {
    return this.status >= StatusCodes.INTERNAL_SERVER_ERROR;
  }

  get isRetryable(): boolean {
    return this.isNetworkError || this.isServerError;
  }

  getFieldsErrors<TField extends string>(): [TField, string][] {
    return this._fieldsErrors as [TField, string][];
  }
}
