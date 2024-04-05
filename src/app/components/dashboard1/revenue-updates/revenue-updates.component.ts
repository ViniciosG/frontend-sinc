import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format, subDays } from 'date-fns';
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
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule, NgForOf,RouterModule,CommonModule,NgIf],
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

    // Subtrai 6 dias da data atual para obter a data de 7 dias atrás
    const startDate = subDays(dataAtual, 6);
    
    // Define as horas, minutos, segundos e milissegundos para 0
    startDate.setHours(0, 0, 0, 0);
    
    // Agora startDate contém a data de 7 dias atrás com as horas zeradas
    this.startDate = startDate;
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
// Obtém o índice do dia da semana atual (0 para domingo, 1 para segunda-feira, ..., 6 para sábado)
const todayIndex = new Date().getDay();

// Ordenar os dados por dia da semana, considerando a lógica circular
item.sort((a: any, b: any) => {
    const dayA = parseInt(a.dayOfWeek) - 1; // Ajusta o índice do dia da semana para começar em 0
    const dayB = parseInt(b.dayOfWeek) - 1; // Ajusta o índice do dia da semana para começar em 0

    // Função auxiliar para calcular a diferença circular entre dois dias da semana
    const circularDiff = (dayA: number, dayB: number, totalDays: number) => {
        const diff = dayA - dayB;
        return (diff + totalDays) % totalDays;
    };

    const totalDays = 7;

    const diffA = circularDiff(dayA, todayIndex, totalDays); // Calcula a diferença circular do dia A para o dia de hoje
    const diffB = circularDiff(dayB, todayIndex, totalDays); // Calcula a diferença circular do dia B para o dia de hoje

    // Ordena de forma que o dia atual seja sempre o último
    if (diffA === 0) {
        return 1;
    }
    if (diffB === 0) {
        return -1;
    }

    return diffA - diffB; // Caso nenhum dos dias seja o dia atual, ordena pela diferença circular
});

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
          name: '',
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
