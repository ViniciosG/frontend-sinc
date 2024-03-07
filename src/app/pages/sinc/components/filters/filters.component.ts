import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  
  @Input() camposFiltro: any[] = [];
  @Output() filtroAlterado = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  onInputChange(event: any, campo: any) {
    this.filtroAlterado.emit({ campo: campo, valor: event.target.value });
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return true;
    }
    const today = new Date();
    return date <= today;
  }

}
