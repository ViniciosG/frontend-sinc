import { NgForOf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format, startOfWeek, subDays } from 'date-fns';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { SalesByDayOfWeekModel } from 'src/app/models/sales-by-day-of-week.model';
import { SalesByDayOfWeekRepository } from 'src/app/repositories/sales-by-day-of-week.repository';
import { MaterialModule } from '../../../material.module';

interface month {
  value: string;
  viewValue: string;
}

export interface revenueChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

@Component({
  selector: 'app-revenue-updates',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule, NgForOf,RouterModule,],
  templateUrl: './revenue-updates.component.html',
})
export class AppRevenueUpdatesComponent {

  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  params: any;
  startDate: Date = new Date();
  endDate: Date = new Date();
  sales: SalesByDayOfWeekModel;
  date_inital: string;
  date_final: string;
  totalValue: string;

  public revenueChart!: Partial<revenueChart> | any;

  constructor(private repository: SalesByDayOfWeekRepository) {
    const dataAtual = new Date();
    const primeiroDiaSemana = startOfWeek(dataAtual, { weekStartsOn: 0 }); // 0 para domingo, 1 para segunda, e assim por diante
  
    this.startDate = subDays(dataAtual, 6); // Subtrai 6 dias da data atual para obter os últimos 7 dias
    this.endDate = dataAtual;
  
    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
  
    this.params = {
      registerInitial: this.date_inital,
      registerFinal: this.date_final,
    };
  
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.sales = resp;
        const value = this.sales.items.reduce((total, item) => total + item.value, 0);
        this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

          this.executarGrafico(this.sales.items);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  numeroParaDiaDaSemana(numero: number): string {
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return diasDaSemana[numero - 1]; // Subtrai 1 porque os dias da semana normalmente começam em 0 (Domingo)
  }
  executarGrafico(item: any) {
    // Ordenar os dados por dia da semana
    item.sort((a: any, b: any) => parseInt(a.dayOfWeek) - parseInt(b.dayOfWeek));
  
    // Mapear os dados para o formato esperado pelo gráfico
    const sourceData = item.map((data: any) => {
      return {
        dayOfWeek: this.numeroParaDiaDaSemana(parseInt(data.dayOfWeek)),
        value: data.value,
        qty: data.qty,
        qtyItems: data.qtyItems
      };
    });
  
    this.revenueChart = {
      series: [
        {
          name: 'Total',
          data: sourceData.map((data:any) => data.value), // Usar os valores do sourceData para os dados da série
          color: '#5D87FF',
        },
      ],
  
      chart: {
        type: 'bar',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 380,
        stacked: true,
      },
  
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20%',
          borderRadius: [6],
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
        },
      },
  
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
        //formatter: (val: any) => `R$ ${val}`, // Adicionar R$ no início do valor
        style: {
          fontSize: '12px',
          colors: ["#000000"]
        },
        offsetY: -20, // Ajustar a posição do rótulo
        textAnchor: 'middle',
        dropShadow: {
          enabled: true
        }
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      yaxis: {
        labels: {
            formatter: (val: any) => {
                const valueFormatted = val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                return valueFormatted;
            }
        }
    },
      xaxis: {
        categories: sourceData.map((data:any) => data.dayOfWeek), // Usar os dias da semana do sourceData para o eixo X
        axisBorder: {
          show: false,
        },
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
      },
    };
}


}
