export interface ApiErrorField {
  message: string;
  path: string;
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    fields?: ApiErrorField[];
    message: string;
  };
  meta?: { requestId: string };
}
