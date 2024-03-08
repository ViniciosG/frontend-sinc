import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule,TablerIconsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  
  @Input() camposFiltro: any[] = [];
  @Output() filtrosEnviados = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  enviarFiltros() {
    this.filtrosEnviados.emit(this.camposFiltro);
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return true;
    }
    const today = new Date();
    return date <= today;
  }

}
