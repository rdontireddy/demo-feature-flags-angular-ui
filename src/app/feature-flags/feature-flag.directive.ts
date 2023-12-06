import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { FeatureFlagService } from './feature-flag.service';
import { Subject, Subscription } from 'rxjs';

@Directive({ selector: '[featureFlag]' })
export class FeatureFlagDirective implements OnInit, OnDestroy {
  @Input() public featureFlag: string | undefined;

  private _subscriptions = new Subscription();
  constructor(
    private tpl: TemplateRef<unknown>,
    private vcr: ViewContainerRef,
    private readonly service: FeatureFlagService
  ) {}

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
  
  ngOnInit(): void {
    if (!this.featureFlag) throw Error('Please provide the feature flag');

    this._subscriptions = this.service
      .getFlag(this.featureFlag, false)
      .subscribe((flagValue) => {
        this.vcr.clear();
        if (flagValue) this.vcr.createEmbeddedView(this.tpl);
      });
  }
}
