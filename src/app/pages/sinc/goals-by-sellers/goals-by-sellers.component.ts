import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { isEqual } from 'lodash';
import { ApexChart, ApexFill, ApexNonAxisChartSeries, ApexPlotOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, interval, switchMap, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { GoalsBySellersModel } from 'src/app/models/goals-by-sellers.model';
import { GoalsBySellersRepository } from 'src/app/repositories/goals-by-sellers.repository';

export interface customerChart {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
}

@Component({
  selector: 'app-goals-by-sellers',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule, CommonModule, FormsModule],
  templateUrl: './goals-by-sellers.component.html',
  styleUrls: ['./goals-by-sellers.component.css']
})
export class GoalsBySellersComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();
  graficos: any[] = [];
  showValue: boolean = true;
  startDate: Date = new Date();
  endDate: Date = new Date();
  goals: GoalsBySellersModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string
  graficoIds: string[] = [];
  SALVAR_RESPOSTA: any;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions!: Partial<customerChart> | any;;

  constructor(private repository: GoalsBySellersRepository) {
    const dataAtual = new Date();

    dataAtual.setDate(1);
    dataAtual.setHours(0, 0, 0, 0);

    this.startDate = dataAtual;
    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    this.inititalContext = format(this.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    this.endContext = format(this.endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });



  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getGoalsBySellers();
    interval(30000)
      .pipe(
        switchMap(async () => { this.getGoalsBySellers() })
      )
      .subscribe();
  }

  montarGrafico(item: any) {
    var percentage = Math.round((item.value / item.goal) * 100);
    if (percentage.toString() == "Infinity") {
      percentage = 0
    }

    return this.chartOptions = {
      series: [percentage],
      chart: {
        type: "radialBar",
        offsetY: 0,
        width: 300,
        height: 300
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#ff414e",
            strokeWidth: "97%",
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              opacity: 0.31,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -4,
              fontSize: "22px"
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        },
        colors: ["#7edfb4"],
      },

      labels: ["Average Results"]
    };

  }


  formatarParaReais(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  isInfinity(value: any) {
    console.log((value.value / value.goal) * 100)
  }

  getGoalsBySellers() {
    this.repository.getGoalsBySellers(this.date_inital, this.date_final).subscribe({
      next: resp => {
        this.goals = resp;

        if (!isEqual(this.SALVAR_RESPOSTA, this.goals)) {
          console.log("ATUALIZANDO...")
          takeUntil(this.destroy$)
          this.SALVAR_RESPOSTA = resp;
          this.graficos = [];

          for (const item of this.goals.items) {
            this.graficos.push(this.montarGrafico(item));
          }
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }


}
