import { AppStorage } from 'core/storage';

const JOURNAL_KEY = 'checkout.idempotency';

interface JournalEntry {
  fingerprint: string;
  key: string;
}

type Journal = Record<string, JournalEntry>;

export class IdempotencyJournal {
  constructor(private readonly _storage: AppStorage) {}

  keyFor = (intent: string, body: unknown): string => {
    const fingerprint = JSON.stringify(body ?? null);
    const journal = this._read();

    if (journal[intent]?.fingerprint === fingerprint) {
      return journal[intent].key;
    }

    const key = crypto.randomUUID();

    this._storage.write<Journal>(JOURNAL_KEY, { ...journal, [intent]: { fingerprint, key } });

    return key;
  };

  release = (intent: string): void => {
    const journal = Object.entries(this._read()).reduce<Journal>((rest, [name, entry]) => {
      if (name !== intent) {
        rest[name] = entry;
      }

      return rest;
    }, {});

    this._storage.write<Journal>(JOURNAL_KEY, journal);
  };

  private _read = (): Journal => this._storage.read<Journal>(JOURNAL_KEY) ?? {};
}
