import { NgFor, NgForOf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/pages/authentication/service/auth.service';
import { BrandingComponent } from '../../vertical/sidebar/branding.component';
import { navItems } from '../../vertical/sidebar/sidebar-data';


@Component({
  selector: 'app-horizontal-header',
  standalone: true,
  imports: [RouterModule, TablerIconsModule, MaterialModule, BrandingComponent, NgFor],
  templateUrl: './header.component.html',
})
export class AppHorizontalHeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  showFiller = false;
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  executeEvent() {
  }
}

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [RouterModule, MaterialModule, TablerIconsModule, FormsModule, NgForOf],
  templateUrl: 'search-dialog.component.html',
})
export class AppHorizontalSearchDialogComponent {
  searchText: string = '';
  navItems = navItems;

  navItemsData = navItems.filter((navitem) => navitem.displayName);

  // filtered = this.navItemsData.find((obj) => {
  //   return obj.displayName == this.searchinput;
  // });
}