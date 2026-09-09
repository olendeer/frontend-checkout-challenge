import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { HttpError } from 'core/http';

export const applyFieldErrors = <TValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TValues>,
): boolean => {
  if (!(error instanceof HttpError) || !error.hasFieldsErrors) {
    return false;
  }

  const fields = error.getFieldsErrors<Path<TValues>>();

  fields.forEach(([path, message]) => setError(path, { message, type: 'server' }));

  return fields.length > 0;
};
