import { HttpClient, RequestConfig } from 'core/http';
import { API } from 'data/endpoints';
import { Session } from 'domain/contracts';

import { SessionRepo } from './session.repo';

export class SessionRepoImpl implements SessionRepo {
  constructor(private readonly _http: HttpClient) {}

  create = async (config?: RequestConfig): Promise<Session> => {
    const response = await this._http.post<Session>(
      API.sessions.toUrl(),
      {},
      {
        ...config,
        skipAuth: true,
      },
    );

    return response.data;
  };
}
