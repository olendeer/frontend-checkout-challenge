import { AppStorage } from 'core/storage';
import { SessionRepo } from 'data/repositories';

import { SessionService } from './session.service';

const TOKEN_KEY = 'checkout.session.token';

export class SessionServiceImpl implements SessionService {
  private _pendingReissue: Promise<string | null> | null = null;

  constructor(
    private readonly _repo: SessionRepo,
    private readonly _storage: AppStorage,
  ) {}

  getToken = (): string | null => this._storage.read<string>(TOKEN_KEY);

  ensureToken = (): Promise<string | null> => {
    const token = this.getToken();

    if (token) {
      return Promise.resolve(token);
    }

    return this.reissueToken();
  };

  reissueToken = (): Promise<string | null> => {
    this._pendingReissue ??= this._create().finally(() => {
      this._pendingReissue = null;
    });

    return this._pendingReissue;
  };

  private _create = async (): Promise<string | null> => {
    const session = await this._repo.create();

    this._storage.write(TOKEN_KEY, session.token);

    return session.token;
  };
}
