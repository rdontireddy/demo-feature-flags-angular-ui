import {
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy,
} from '@angular/core';
import * as LaunchDarkly from 'launchdarkly-js-client-sdk';
import { LDFlagSet, LDFlagValue } from 'launchdarkly-js-client-sdk';
import { BehaviorSubject, Observable } from 'rxjs';

export const LD_CLIENT_ID = new InjectionToken<string>(
  'Launchdarkly Client Secret'
);

export interface IFeatureFlagContext {
    userId: string;
    userName: string;
} 

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService implements OnDestroy {
  private _client: LaunchDarkly.LDClient | undefined;
  private _flags: LDFlagSet | undefined;
  private readonly _flagChange$: BehaviorSubject<Object> = new BehaviorSubject<Object>({});

  public readonly flagChange$: Observable<Object> = this._flagChange$.asObservable();

  constructor(@Inject(LD_CLIENT_ID) private readonly ldClientKey: string) {}

  async ngOnDestroy() {
    await this._client?.close();
  }

  public initialize(): boolean {
    const user = {
      anonymous: true,
    } as LaunchDarkly.LDContext;
    this._client = LaunchDarkly.initialize(this.ldClientKey, user);

    return this._client ? true : false;
  }

  public getFlag(flagKey: string, defaultValue: LDFlagValue): Observable<LDFlagValue> {
    this._client?.waitUntilReady().then(() => {
      this._flags = this._client?.allFlags();
      const flagsArray = Object.entries(this._flags ?? []);

      flagsArray.filter(([key, value]) => {
        if (key === flagKey) {
          this._setFlag(key, defaultValue);
          return value;
        } else {
          return defaultValue;
        }
      });

      this._client?.on('initialized', (flags) => {
        this._flags = { ...flags };
      });

      this._client?.on(`change:${flagKey}`, (flagValue) => {
        this._setFlag(flagKey, defaultValue);
      });
    });

    return this.flagChange$;
  }

  public async UpdateIdentityContext(context : IFeatureFlagContext) {
    const ldContext: LaunchDarkly.LDContext = {
        kind: 'user',
        key: context.userId,
        name: context.userName
    }
    await this._client?.identify(ldContext)
  }

  private _setFlag(flagKey: string, defaultValue: any) {
    this._flagChange$.next(this._client?.variation(flagKey, defaultValue));
  }
}
