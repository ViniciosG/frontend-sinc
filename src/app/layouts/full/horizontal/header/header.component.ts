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
import { GetCompanyService } from 'src/app/services/get-company.service';
import { BrandingComponent } from '../../vertical/sidebar/branding.component';
import { navItems } from '../../vertical/sidebar/sidebar-data';


interface notifications {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

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
  company:any;
  showFiller = false;
  constructor(
    public dialog: MatDialog,
    private companyService: GetCompanyService,
    private auth: AuthService,
    private translate: TranslateService
  ) {
    this.auth.onSaveSuccess.subscribe(() => {
      this.company = this.companyService.getCompany();
    });
  }

  ngOnInit(): void {
    this.company = this.companyService.getCompany();
    
  }

  executeEvent() {
    this.company = this.companyService.getCompany();
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