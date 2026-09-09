import { RequestConfig } from 'core/http';
import { Session } from 'domain/contracts';

export interface SessionRepo {
  create: (config?: RequestConfig) => Promise<Session>;
}
