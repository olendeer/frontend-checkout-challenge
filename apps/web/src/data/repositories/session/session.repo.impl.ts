import type { Static } from '@sinclair/typebox';
import type { SessionSchema } from '@checkout/contracts';

import { HttpClient, RequestConfig } from 'core/http';
import { SessionDto } from 'data/dto/session';
import { API } from 'data/endpoints';
import { Session } from 'domain/session/entities';

import { SessionRepo } from './session.repo';

export class SessionRepoImpl implements SessionRepo {
  constructor(private readonly _http: HttpClient) {}

  create = async (config?: RequestConfig): Promise<Session> => {
    const response = await this._http.post<Static<typeof SessionSchema>>(
      API.sessions.toUrl(),
      {},
      {
        ...config,
        skipAuth: true,
      },
    );

    return SessionDto.mapToEntity(response.data);
  };
}
