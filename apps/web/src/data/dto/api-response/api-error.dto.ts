import { HttpError, HttpErrorCodes, HttpErrorMessage } from 'core/http';

import { ApiErrorEnvelope, ApiErrorField } from './api-error.response';

export class ApiErrorDto {
  static mapToEntity(body: unknown, status: number): HttpError {
    const envelope = body as ApiErrorEnvelope | null;

    if (!envelope?.error) {
      return new HttpError(HttpErrorMessage.unknown, status, HttpErrorCodes.UNKNOWN);
    }

    return new HttpError(
      envelope.error.message || HttpErrorMessage.unknown,
      status,
      envelope.error.code,
      ApiErrorDto.mapToFieldsErrors(envelope.error.fields),
      envelope.meta?.requestId,
    );
  }

  static mapToFieldsErrors(fields: ApiErrorField[] = []): [string, string][] {
    return fields.map((field) => [ApiErrorDto.mapToFieldPath(field.path), field.message]);
  }

  static mapToFieldPath(path: string): string {
    return path
      .replace(/^(body|query|params|headers)\//, '')
      .split('/')
      .join('.');
  }
}
