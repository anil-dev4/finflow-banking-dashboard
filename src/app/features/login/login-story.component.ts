import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrandComponent } from '../../shared/brand.component';
import { IconComponent } from '../../shared/icon.component';
import { DashboardPreviewComponent } from './dashboard-preview.component';

@Component({
  selector: 'app-login-story',
  imports: [BrandComponent, IconComponent, DashboardPreviewComponent],
  templateUrl: './login-story.component.html',
  styleUrl: './login-story.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStoryComponent {}
