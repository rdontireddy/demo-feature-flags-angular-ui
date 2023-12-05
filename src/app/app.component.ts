import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FeatureFlagModule,FeatureFlagService } from './feature-flags';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FeatureFlagModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
  showSocialLinks: Observable<boolean> | undefined

  constructor(private readonly featureFlagService: FeatureFlagService) {

  }
  async ngOnInit() {    
    await this.featureFlagService.UpdateIdentityContext({userId: '123', userName:'Raj Dontireddy'});    
  }
  title = 'demo-feature-flags-angular-ui';
}
