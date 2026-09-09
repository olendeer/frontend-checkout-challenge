export type EndpointParams<T extends string> = T extends string ? Record<T, string> : never;

export interface EndpointInterface<T extends string = never> {
  readonly baseUrl: string;

  toUrl(map?: EndpointParams<T>): string;
}
