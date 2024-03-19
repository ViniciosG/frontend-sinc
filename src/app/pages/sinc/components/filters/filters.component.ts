import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { endOfDay, endOfWeek, endOfYear, startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
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

  
  
  // Função auxiliar para obter o último domingo
  getLastSunday(date: Date): Date {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 0); // Se o dia for domingo (0), subtrai 6 dias
    return new Date(date.setDate(diff));
  }
  
  onChangeOption(option: string) {
    const today = new Date();
    if (option === 'today') {
      const startOfToday = startOfDay(today); // Início do dia atual (00:00)
      const endOfToday = endOfDay(today); // Fim do dia atual (último segundo)
      this.updateDateFilterValue(startOfToday, endOfToday);
    } else if (option === 'lastWeek') {
      const lastSunday = startOfWeek(today);
      const lastSaturday = endOfWeek(today);
      this.updateDateFilterValue(lastSunday, lastSaturday);
    } else if (option === 'thisMonth') {
      const thisMonthStartDate = startOfMonth(today);
      this.updateDateFilterValue(thisMonthStartDate, today);
    } else if (/^\d{4}$/.test(option)) {
      const selectedYear = parseInt(option, 10);
      const yearStartDate = startOfYear(new Date(selectedYear, 0, 1));
      const yearEndDate = endOfYear(yearStartDate); // Último dia do ano do yearStartDate
      this.updateDateFilterValue(yearStartDate, yearEndDate);
    }
  }
  
  
  private updateDateFilterValue(startDate: Date, endDate: Date) {
    console.log(endDate)
    const campoInicial = this.camposFiltro.find(campo => campo.id === 'registerInitial');
    const campoFinal = this.camposFiltro.find(campo => campo.id === 'registerFinal');
    

      campoInicial.value = startDate;
      campoFinal.value = endDate;
    
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
