import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ApexChart, ApexFill, ApexNonAxisChartSeries, ApexPlotOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, interval, takeUntil } from 'rxjs';
import { yearlyChart } from 'src/app/components/dashboard1/yearly-breakup/yearly-breakup.component';
import { MaterialModule } from 'src/app/material.module';
import { GoalsBySellersModel } from 'src/app/models/goals-by-sellers.model';
import { GoalsBySellersByMonthRepository } from 'src/app/repositories/goals-by-sellers-by-month.repository';
import { CoreService } from 'src/app/services/core.service';
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
  isValorVisible = false;
  isValorVisibleGeral = true;
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
  camposFiltro: any
  quantidadeValor: string;
  valorTotalGeral: number;
  metaTotalGeral: number;
  somaArredondada: any;
  loading: boolean = false;
  metaGeral: any;
  public yearlyChart!: Partial<yearlyChart> | any;
  public chartOptions!: Partial<customerChart> | any;
  options = this.settings.getOptions();

  constructor(private repository: GoalsBySellersByMonthRepository,private settings: CoreService,) {
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
      registerFinal: this.date_final,
      _direction: 'DESC',
      _sort: 'goal',
    }

    this.camposFiltro = [
      { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: false, id: "sellerName" },
      { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: false, id: "sellerType" },
      { label: 'Ranking', placeholder: 'Ranking', type: 'select', visivel: false, options: ['5', '10', '20', '30'], id: "_limit" },
      { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: false, value: this.startDate, id: "registerInitial" },
      { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: false, value: this.endDate, id: "registerFinal" },
      {
        label: 'Filtrar', placeholder: 'Filtrar', type: 'select', visivel: false, value: 'thisMonth', options: [
          { label: 'Hoje', value: 'today' },
          { label: 'Semana', value: 'lastWeek' },
          { label: 'Mês', value: 'thisMonth' }
        ], id: 'dateSelector'
      },
    ];

    this.options.sidenavCollapsed = false;
    this.settings.setOptions(this.options);
  }

  abreviarNome(nome: string): string {
    if (!nome || nome.trim().length === 0) {
        return "SEM NOME";
    }

    if (nome.includes('.')) {
        return nome;
    }

    const partesNome = nome.trim().split(' ');

    if (partesNome.length >= 2) {
        if (partesNome[1].length <= 3) {
            return partesNome[0] + ' ' + partesNome[partesNome.length - 1];
        } else {
            return partesNome[0] + ' ' + partesNome[1];
        }
    } else {
        return nome;
    }
}



  receberFiltros(event: any) {
    this.camposFiltro.forEach((campo: any) => {
      if (campo.id && campo.value !== undefined) {
        if (campo.type === 'date') {
          const dataFormatada = format(campo.value, "yyyy-MM-dd'T'HH:mm:ssXXX");
          this.params[campo.id] = dataFormatada;
        } else {
          this.params[campo.id] = campo.value;
        }
      }
    });
    delete this.params['dateSelector'];
    this.getGoalsBySellers()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getGoalsBySellers();
      interval(30000)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.getGoalsBySellers();
        });
  }


  montarGrafico(item: any) {7

    var percentage;
    if (item.value !== 0 && item.goal !== 0) {
      percentage = Math.round((item.value / item.goal) * 100);
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
         height: 300
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#f93643",
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
              offsetY: -5,
              fontSize: "30px",
              color: "#000",
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
        colors: ["#1a995d"],
      },
    };
  }

  formatarParaReais(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getGoalsBySellers() {
    this.graficos.push([]);
    this.loading = true;
    this.repository.call(this.params).subscribe({
      next: resp => {
        const respString = JSON.stringify(resp);
        if (respString !== this.SALVAR_RESPOSTA) {
          this.SALVAR_RESPOSTA = respString;
          this.goals = resp;
          this.graficos = [];
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
          this.somaArredondada = somaArredondada

          this.metaTotalGeral = this.goals.items.reduce((total, item) => total + item.goal, 0);

          if (this.goals.items.length > 1) {
            const sellerData = {
              sellerId: -999,
              sellerName: "META MENSAL",
              value: somaArredondada,
              qty: 1,
              qtyItems: 1,
              goal: this.metaTotalGeral
            };
            this.goals.items.unshift(sellerData);
          }


          for (const item of this.goals.items) {
            this.graficos.push(this.montarGrafico(item));
          }
          this.loading = false;
        }
      },
      error: error => {
        this.graficos = [];
        this.loading = false;
      }
    });
  }


  toggleValorVisibility() {
    this.isValorVisible = !this.isValorVisible; 
  }





}
