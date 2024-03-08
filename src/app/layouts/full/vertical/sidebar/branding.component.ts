import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="branding">
      <a href="/" *ngIf="options.theme === 'light'">
        <img
          src="./assets/images/logos/engendra-logo.png"
          class="align-middle m-2"
          width="200px"
          height="65px"
          alt="logo"
        />
      </a>
      <a href="/" *ngIf="options.theme === 'dark'">
      <img
          src="./assets/images/logos/engendra-logo.png"
          class="align-middle m-2"
          width="200px"
          height="65px"
          alt="logo"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();
 
  constructor(private settings: CoreService) {}
}
