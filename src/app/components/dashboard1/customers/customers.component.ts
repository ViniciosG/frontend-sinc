import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format } from 'date-fns';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { NewCustomersPerMonthModel } from 'src/app/models/new-customers-per-month.model';
import { NewCustomersPerMonthsRepository } from 'src/app/repositories/new-customers.per-month.repository';
import { MaterialModule } from '../../../material.module';

export interface customerChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}
@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule,NgIf],
  templateUrl: './customers.component.html',
})
export class AppCustomersComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public customerChart!: Partial<customerChart> | any;
  startDate: Date = new Date();
  endDate: Date = new Date();
  customers: NewCustomersPerMonthModel;
  date_inital: string;
  date_final: string;
  params: any;
  quantidadeClientes: string;
  dataAtual:any
  percentage:any
  constructor(private repository: NewCustomersPerMonthsRepository) {

    const dataAtual = new Date();
    this.dataAtual = dataAtual.getFullYear()
    dataAtual.setFullYear(new Date().getFullYear(), 0, 1); // Janeiro é representado por 0
    dataAtual.setHours(0, 0, 0, 0); // Define o horário para 00:00:00

    this.startDate = dataAtual;

    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
    }

    

  }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.customers = resp;
          const sortedItems = this.customers.items.sort((a, b) => a.month.localeCompare(b.month));
          const ultimoItem = sortedItems[sortedItems.length - 1];
          this.quantidadeClientes = ultimoItem.qty.toLocaleString('pt-BR');
          
          this.executar(sortedItems);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  executar(items:any) {
    const quantities = items.map((data: any) => data.qty);

if (quantities.length >= 2) {
    const lastQuantity = quantities[quantities.length - 1];
    const penultimateQuantity = quantities[quantities.length - 2];

    // Calcular a variação percentual
    const variationPercentage = ((lastQuantity - penultimateQuantity) / penultimateQuantity) * 100;
    
    // Arredondar para o número inteiro mais próximo
    this.percentage = Math.round(variationPercentage);
}




    this.customerChart = {
      series: [
        {
          name: '',
          color: '#49BEFF',
          data: quantities,
        },
      ],

      chart: {
        type: 'area',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 80,
        sparkline: {
          enabled: true,
        },
        group: 'sparklines',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        colors: ['#E8F7FF'],
        type: 'solid',
        opacity: 0.05,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        x: {
          show: false,
        },
      },
    };
  }
}
