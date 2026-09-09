import { AuthProvider } from 'core/http';

export interface SessionService extends AuthProvider {
  ensureToken: () => Promise<string | null>;
}
