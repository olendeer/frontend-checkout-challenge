import { RequestConfig } from 'core/http';
import { Session } from 'domain/session/entities';

export interface SessionRepo {
  create: (config?: RequestConfig) => Promise<Session>;
}
