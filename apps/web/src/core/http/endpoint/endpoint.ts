import { buildUrl } from 'core/utils';

import { EndpointInterface, EndpointParams } from './endpoint.types';

export class Endpoint<T extends string = never> implements EndpointInterface<T> {
  constructor(private readonly _baseUrl: string) {}

  get baseUrl(): string {
    return this._baseUrl;
  }

  toUrl(map?: EndpointParams<T>): string {
    if (map) {
      return buildUrl(this.baseUrl, map);
    }

    return this.baseUrl;
  }
}
