import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format, startOfDay } from 'date-fns';
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
import { GoalsBySellersModel } from 'src/app/models/goals-by-sellers.model';
import { GoalsBySellersRepository } from 'src/app/repositories/goals-by-sellers.repository';
import { MaterialModule } from '../../../material.module';

export interface yearlyChart {
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
  selector: 'app-yearly-breakup',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, TablerIconsModule,CommonModule,NgIf],
  templateUrl: './yearly-breakup.component.html',
})
export class AppYearlyBreakupComponent {

  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public yearlyChart!: Partial<yearlyChart> | any;
  goals: GoalsBySellersModel;
  params: any;
  valorTotalGeral: number;
  metaTotalGeral: string;
  somaArredondada:any;
  metaGeral:any;
  date_inital: string;
  date_final: string;
  percentage: any;

  constructor(private repository: GoalsBySellersRepository) {
    const dataAtual = new Date();

    const startDate = startOfDay(dataAtual);
    const endDate = new Date();
  
    this.date_inital = format(startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
    }

  }

  ngOnInit(): void {
    this.getGoalsBySellers();
  }

  executarGrafico(percentage:any) {
    const value = 100 - percentage;
    this.yearlyChart = {
      series: [percentage,value],

      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 130,
      },
      colors: ['#5D87FF', '#ECF2FF', '#F9F9FD'],
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          donut: {
            size: '75%',
            background: 'transparent',
          },
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 991,
          options: {
            chart: {
              width: 120,
            },
          },
        },
      ],
      tooltip: {
        enabled: false,
      },
    };
  }

  getGoalsBySellers() {
    this.repository.call(this.params).subscribe({
        next: resp => {
            this.goals = resp;
                let somaValues = 0;

                for (const item of resp.items) {
                    if (item.value === null || item.value === undefined) {
                        item.value = 0;
                    }
                    if (item.goal === null || item.goal === undefined) {
                        item.goal = 0;
                    }

                    if (typeof item.value === 'number' && !isNaN(item.value)) {
                        somaValues += item.value;
                    }
                }

                const somaArredondada = Math.round(somaValues * 100) / 100;
                this.somaArredondada = somaArredondada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                const metaGeralConvert = this.goals.items.reduce((total, item) => total + item.goal, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                this.metaTotalGeral = metaGeralConvert

                
                  this.percentage  = Math.round((somaValues / this.goals.items.reduce((total, item) => total + item.goal, 0)) * 100);
                  if (this.percentage.toString() == "Infinity") {
                    this.percentage = 0
                  }
                
                this.executarGrafico(this.percentage)
        },
        error: error => {
            console.log(error);
        }
    });
}
}
