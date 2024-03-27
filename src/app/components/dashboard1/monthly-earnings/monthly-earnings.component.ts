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
import { GoalsBySellersModel } from 'src/app/models/goals-by-sellers.model';
import { MaterialModule } from '../../../material.module';
import { GoalsBySellersByMonthRepository } from './../../../repositories/goals-by-sellers-by-month.repository';

export interface monthlyChart {
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
  selector: 'app-monthly-earnings',
  standalone: true,
  imports:[NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './monthly-earnings.component.html',
})
export class AppMonthlyEarningsComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public monthlyChart!: Partial<monthlyChart> | any;
  startDate: Date = new Date();
  endDate: Date = new Date();
  goals: GoalsBySellersModel;
  date_inital: string;
  date_final: string;
  params: any;
  valorTotalGeral: number;
  metaTotalGeral: string;
  somaArredondada:any;
  metaGeral:any;
  percentage: any;
  constructor(private repository: GoalsBySellersByMonthRepository) {


    const dataAtual = new Date();

    dataAtual.setDate(1);
    dataAtual.setHours(0, 0, 0, 0);

    this.startDate = dataAtual;

    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
      _direction: 'DESC',
      _sort: 'goal',
    }

    this.getGoalsBySellers();
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
                
                this.executarGrafico(this.goals.items)
        },
        error: error => {
            console.log(error);
        }
    });
}

executarGrafico(item:any) {
  const values = item.map((data: any) => data.value);
  this.monthlyChart = {
    series: [
      {
        name: '',
        color: '#49BEFF',
        data: [values],
      },
    ],

    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 60,
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
      theme: 'dark',
      x: {
        show: false,
      },
    },
  };
}
}
