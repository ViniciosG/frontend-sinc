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
import { GoalsBySellersByMonthRepository } from 'src/app/repositories/goals-by-sellers-by-month.repository';
export interface customerChart {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
}

@Component({
  selector: 'app-goals-by-sellers-month',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule, CommonModule, FormsModule],
  templateUrl: './goals-by-sellers-month.component.html',
  styleUrls: ['./goals-by-sellers-month.component.css']
})
export class GoalsBySellersMonthComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();
  graficos: any[] = [];
  graficosGeral: any[] = [];
  showValue: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();
  goals: GoalsBySellersModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string
  graficoIds: string[] = [];
  SALVAR_RESPOSTA: any;
  params: any;
  camposFiltro:any
  quantidadeValor: string;
  valorTotalGeral: number;
  metaTotalGeral: number;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions!: Partial<customerChart> | any;;

  constructor(private repository: GoalsBySellersByMonthRepository) {
    const dataAtual = new Date();

    dataAtual.setDate(1);
    dataAtual.setHours(0, 0, 0, 0);

    this.startDate = dataAtual;

    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.inititalContext = format(this.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    this.endContext = format(this.endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }); 

    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
      _direction: 'DESC',
      _sort: 'goal',
    }
    
    this.camposFiltro = [
      { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: false, id: "sellerName" },
      { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: false, id: "sellerType" },
      { label: 'Ranking', placeholder: 'Ranking', type: 'select', visivel: false, options: ['5', '10', '20','30'], id: "_limit" },
      { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: false, value: this.startDate, id: "registerInitial" },
      { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: false, value: this.endDate, id: "registerFinal" },
      { label: 'Filtrar', placeholder: 'Filtrar', type: 'select', visivel: false, value:'thisMonth', options: [
        { label: 'Hoje', value: 'today' },
        { label: 'Semana', value: 'lastWeek' },
        { label: 'Mês', value: 'thisMonth' }
      ], id: 'dateSelector' },
    ];
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
    var percentage;
    if(item.value !== null && item.goal !== null) {
      percentage  = Math.round((item.value / item.goal) * 100);
      if (percentage.toString() == "Infinity") {
        percentage = 0
      }
    } else {
      percentage = 0
    }

    return this.chartOptions = {
      series: [percentage],
      chart: {
        type: "radialBar",
        offsetY: 0,
        height: 175
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
    };

  }

  montarGraficoGeral(item: any) {
    var percentage;
    if(item.value !== null && item.goal !== null) {
      percentage  = Math.round((item.value / item.goal) * 100);
      if (percentage.toString() == "Infinity") {
        percentage = 0
      }
    } else {
      percentage = 0
    }
    return this.chartOptions = {
      series: [percentage],
      chart: {
        type: "radialBar",
        offsetY: 0,
        height: 300,
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
    };
  }


  formatarParaReais(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getGoalsBySellers() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.goals = resp;
        if (!isEqual(this.SALVAR_RESPOSTA, this.goals)) {
          takeUntil(this.destroy$)
          this.SALVAR_RESPOSTA = resp;
          this.graficos = [];
          this.graficosGeral = [];
          let somaValues = 0;

          for (const item of resp.items) {
              if (typeof item.value === 'number' && !isNaN(item.value)) {
                  somaValues += item.value;
              }
          }
          
          const somaArredondada = Math.round(somaValues * 100) / 100;

          this.metaTotalGeral = this.goals.items.reduce((total, item) => total + item.goal, 0);

          const sellerData = {
            sellerId: -999,
            sellerName: "META MENSAL",
            value: somaArredondada,
            qty: 1,
            qtyItems: 1,
            goal: this.metaTotalGeral
          };

          this.goals.items.push(sellerData)

          this.graficosGeral.push(this.montarGraficoGeral(sellerData))

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

  abreviarNome(nome: string): string {
    // Verificar se o nome está em branco ou é nulo
    if (!nome || nome.trim().length === 0) {
        return "SEM NOME"; // Retorna "SEM NOME" se o nome estiver em branco ou for nulo
    }

    // Verificar se o nome contém ponto
    if (nome.includes('.')) {
        return nome; // Retornar o nome original se contiver ponto
    }

    // Verificar se o nome tem apenas 4 letras
    if (nome.trim().length === 4) {
        return nome; // Retornar o nome original se tiver apenas 4 letras
    }

    // Dividir o nome em partes
    const partesNome = nome.split(' ');

    // Verificar se há mais de duas partes no nome
    if (partesNome.length > 2) {
        // Se houver mais de duas partes no nome, verificar se o segundo nome tem apenas 2 letras
        if (partesNome[1].trim().length === 2 || partesNome[1].trim().length === 3) {
            // Se o segundo nome tiver apenas 2 letras, retornar o terceiro nome
            return partesNome[0] + ' ' + partesNome[2];
        } else {
            // Caso contrário, manter apenas a primeira e a segunda parte
            return partesNome[0] + ' ' + partesNome[1];
        }
    } else {
        // Se houver duas partes no nome, retorne o nome original
        return nome;
    }
}

}
