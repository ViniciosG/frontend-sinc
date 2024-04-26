import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/pages/authentication/service/auth.service';

@Component({
  selector: 'app-header',
  
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {

  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() doLogout = new EventEmitter<void>();
  showFiller = false;


  constructor(
    public dialog: MatDialog,
    public auth: AuthService,
  ) {
  }
  ngOnInit(): void {
  }

  openDialog() {

  }

  makeLogout() {
    this.auth.doLogout()
  }

  // changeLanguage(lang: any): void {
  //   this.translate.use(lang.code);
  //   this.selectedLanguage = lang;
  // }
}
