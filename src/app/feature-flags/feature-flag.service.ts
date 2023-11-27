import {
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy,
  inject,
} from '@angular/core';
import * as LaunchDarkly from 'launchdarkly-js-client-sdk';
import { LDFlagSet, LDFlagValue } from 'launchdarkly-js-client-sdk';
import { BehaviorSubject, Observable } from 'rxjs';

export const LD_CLIENT_ID = new InjectionToken<string>(
  'Launchdarkly Client Secret'
);

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService implements OnDestroy {
  client: LaunchDarkly.LDClient | undefined;
  flags: LDFlagSet | undefined;

  private _flagChange$: BehaviorSubject<Object> = new BehaviorSubject<Object>(
    {}
  );
  flagChange$: Observable<Object> = this._flagChange$.asObservable();
  constructor(@Inject(LD_CLIENT_ID) private readonly ldClientKey: string) {}

  async ngOnDestroy() {
    await this.client?.close();
  }

  initialize(): boolean {
    const user = {
      anonymous: true,
    } as LaunchDarkly.LDContext;
    this.client = LaunchDarkly.initialize(this.ldClientKey, user);

    return this.client ? true : false;
  }

  getFlag(flagKey: string, defaultValue: LDFlagValue): Observable<LDFlagValue> {
    this.client?.waitUntilReady().then(() => {
      this.flags = this.client?.allFlags();
      const flagsArray = Object.entries(this.flags ?? []);

      flagsArray.filter(([key, value]) => {
        if (key === flagKey) {
          this.setFlag(key, defaultValue);
          return value;
        } else {
          return defaultValue;
        }
      });

      this.client?.on('initialized', (flags) => {
        this.flags = { ...flags };
      });

      this.client?.on(`change:${flagKey}`, (flagValue) => {
        this.setFlag(flagKey, defaultValue);
      });
    });

    return this.flagChange$;
  }

  setFlag(flagKey: string, defaultValue: any) {
    this._flagChange$.next(this.client?.variation(flagKey, defaultValue));
  }
}
