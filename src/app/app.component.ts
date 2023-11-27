import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { FeatureFlagService } from './feature-flags/feature-flag.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
  showSocialLinks: Observable<boolean> | undefined

  constructor(private readonly featureFlagService: FeatureFlagService) {

  }
  ngOnInit(): void {
    this.showSocialLinks = this.featureFlagService.getFlag('social-media-links', false);
  }
  title = 'demo-feature-flags-angular-ui';
}
