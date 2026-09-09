import { describe, expect, it } from 'vitest';

import { HttpErrorCodes } from 'core/http';
import { ApiErrorDto } from 'data/dto/api-response';

describe('разбор ошибки API', () => {
  it('переводит поля ответа в пути полей формы', () => {
    const error = ApiErrorDto.mapToEntity(
      {
        error: {
          code: 'VALIDATION_ERROR',
          fields: [
            { message: 'must match format email', path: 'body/customer/email' },
            { message: 'must match pattern', path: 'body/delivery/address/city' },
          ],
          message: 'Проверьте формат и поля запроса.',
        },
        meta: { requestId: 'req-1' },
      },
      400,
    );

    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.status).toBe(400);
    expect(error.requestId).toBe('req-1');
    expect(error.hasFieldsErrors).toBe(true);
    expect(error.getFieldsErrors()).toEqual([
      ['customer.email', 'must match format email'],
      ['delivery.address.city', 'must match pattern'],
    ]);
  });

  it('не падает на ответе без тела ошибки', () => {
    const error = ApiErrorDto.mapToEntity(null, 500);

    expect(error.code).toBe(HttpErrorCodes.UNKNOWN);
    expect(error.isServerError).toBe(true);
    expect(error.hasFieldsErrors).toBe(false);
  });
});
