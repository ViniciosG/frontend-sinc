import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { isEqual } from 'lodash';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexPlotOptions, ApexTheme, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { SalesByMonthModel } from 'src/app/models/sales-by-month.model';
import { SalesByMonthRepository } from 'src/app/repositories/sales-by-month.repository';
import { FiltersComponent } from '../components/filters/filters.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

export type ChartOptionsMixed2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
};
@Component({
  selector: 'app-sales-by-month',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, NgApexchartsModule,TablerIconsModule, FiltersComponent],
  templateUrl: './sales-by-month.component.html',
  styleUrls: ['./sales-by-month.component.css']
})
export class SalesByMonthComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();

  startDate: Date = new Date();
  endDate: Date = new Date();
  sales: SalesByMonthModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string;
  SALVAR_RESPOSTA: any;
  option: any;
  totalValue: string;
  selectValue: number = 5;
  legendStateInitialized = false;
  quantidadeVendas: string;
  quantidadeItems:string;
  params: any;
  camposFiltro:any;

  public areaChartOptions: Partial<ChartOptions> | any;
  public chartOptionsMixed: Partial<ChartOptions> | any;

  constructor(private repository: SalesByMonthRepository) {

    const dataAtual = new Date();
    dataAtual.setDate(1);
    dataAtual.setHours(0, 0, 0, 0);
    dataAtual.setFullYear(new Date().getFullYear(), 0, 1);


    this.startDate = dataAtual;

    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    
    this.selectValue = dataAtual.getFullYear();

    const anoAtual = new Date().getFullYear();
    const listaAnos = Array.from({ length: anoAtual - 2008 + 1 }, (_, index) => (2008 + index).toString());
    
    this.camposFiltro = [
      { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: true, id: "sellerName" },
      { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: true, id: "sellerType" },
      { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: this.startDate, id: "registerInitial" },
      { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: false, value: this.endDate, id: "registerFinal" },

      { 
        label: 'Ano', 
        placeholder: 'Ano', 
        type: 'select', 
        visivel: true, 
        value: anoAtual.toString(), 
        options: listaAnos.map(ano => ({ label: ano, value: ano })) 
        , id: 'yearSelecetor' 
      },
    ];

    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
    };
  }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  receberFiltros(event: any) {
    console.log(event)
    this.camposFiltro.forEach((campo: any) => {
      // Verificar se o campo tem um valor e um id definido
      if (campo.id && campo.value !== undefined) {
        // Verificar se o campo é do tipo "date"
        if (campo.type === 'date') {
          // Formatando a data usando o date-fns
          const dataFormatada = format(campo.value, "yyyy-MM-dd'T'HH:mm:ssXXX");
          // Atualizar o valor correspondente no objeto params com base no id do campo
          this.params[campo.id] = dataFormatada;
        } else {
          // Se não for um campo de data, atribuir o valor diretamente ao objeto params
          this.params[campo.id] = campo.value;
        }
      }
    });
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.sales = resp;
  
        if (!isEqual(this.SALVAR_RESPOSTA, this.sales)) {
          takeUntil(this.destroy$)
          this.SALVAR_RESPOSTA = resp;
          const value = this.sales.items.reduce((total, item) => total + item.value, 0);

          
          this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          this.quantidadeVendas = this.sales.items.reduce((total, item) => total + item.qty, 0).toLocaleString('pt-BR');
          this.quantidadeItems = this.sales.items.reduce((total, item) => total + item.qtyItems, 0).toLocaleString('pt-BR');
  
          this.executarGraficoBarras(this.sales.items);
          this.montarGrafico(this.sales.items);

        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  executarGraficoBarras(item: any): echarts.EChartsOption {
    // Ordena os dados pelo dia da semana de forma ascendente
    item.sort((a: any, b: any) => parseInt(a.month) - parseInt(b.month));
  
    const sourceData = item.map((data:any) => {
      return {
        month: this.numeroParaMes(parseInt(data.month)),
        value: data.value,
        qty: data.qty,
        qtyItems: data.qtyItems
      };
    });
  
    const option: echarts.EChartsOption = {
      title: {
        text: 'Vendas por Mês', // Título do gráfico
        left: 'center' // Alinhamento do título
      },
      legend: {
        data: ['Valor', 'Qtd. Vendas', 'Qtd. Itens'], // Texto da legenda
        top: 30 // Posição da legenda
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      dataset: {
        source: sourceData
      },
      xAxis: { 
        type: 'category',
        name: 'Mês', // Rótulo do eixo X
        data: sourceData.month
      },
      yAxis: [
        { 
          name: 'Valor', // Rótulo do eixo Y
        },
        {
          type: 'log', // Escala logarítmica para o eixo Y
          name: 'Quantidade', // Rótulo do segundo eixo Y
        }
      ],
      grid: {
        containLabel: true // Ajustar automaticamente para incluir rótulos
      },
      series: [
        { 
          name: 'Valor', 
          type: 'bar', 
          encode: { x: 'month', y: 'value' },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              const valueFormatted = params.value.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              return `{a|${valueFormatted}} 💰`; // Usando formatação de texto enriquecido
            },
            rich: {
              a: {
                fontWeight: 'bold',
                color: 'black' // Alterando a cor da fonte
              }
            }  
          } 
        },
        { 
          name: 'Qtd. Vendas',
          type: 'bar', 
          encode: { x: 'month', y: 'qty' }, 
          yAxisIndex: 1,
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              const valueFormatted = params.value.qty.toLocaleString('pt-BR');
              return `{a|${valueFormatted}} 🛒`; // Usando formatação de texto enriquecido
            },
            rich: {
              a: {
                fontWeight: 'bold',
                color: 'black' // Alterando a cor da fonte
              }
            }  
          }
        },
        { 
          name: 'Qtd. Itens', 
          type: 'bar', 
          encode: { x: 'month', y: 'qtyItems' }, 
          yAxisIndex: 1,
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              const valueFormatted = params.value.qtyItems.toLocaleString('pt-BR');
              return `{a|${valueFormatted}} 📦`; // Usando formatação de texto enriquecido
            },
            rich: {
              a: {
                fontWeight: 'bold',
                color: 'black' // Alterando a cor da fonte
              }
            }  
          }
        }
      ],
      toolbox: {
        feature: {
          magicType: {
            type: ['line', 'bar'], // Remova 'pie' do array de tipos de série
            show: true,
            title: {
              line: 'Exibir como linha',
              bar: 'Exibir como barra'
            }
          },
        }
      }
    };
  
    const elementoGrafico = document.getElementById('grafico-echarts');
    if (elementoGrafico) {
      const meuGrafico = echarts.init(elementoGrafico);
      meuGrafico.setOption(option);
      
      if (!this.legendStateInitialized) {
        meuGrafico.dispatchAction({
          type: 'legendToggleSelect',
          name: 'Qtd. Itens'
        });
        meuGrafico.dispatchAction({
          type: 'legendToggleSelect',
          name: 'Qtd. Vendas'
        });

        this.legendStateInitialized = true;
      }
    }


  
    return option;
}

numeroParaMes(numero: number): string {
  const data = parse(`${numero}/2024`, 'MM/yyyy', new Date());
  return format(data, 'MMMM', { locale: ptBR });
}




@HostListener('window:resize', ['$event'])
onResize(event: any) {
  this.atualizarGrafico();
}



atualizarGrafico() {
  const elementoGrafico = document.getElementById('grafico-echarts');    
  if (elementoGrafico) {
    const meuGrafico = echarts.init(elementoGrafico);
    meuGrafico.resize();
  }
}


montarGrafico(months: any) {

  months.sort((a: any, b: any) => parseInt(a.month) - parseInt(b.month));
  
  const sourceData = months.map((data:any) => {
    return {
      month: this.numeroParaMes(parseInt(data.month)),
      value: data.value,
      qty: data.qty,
      qtyItems: data.qtyItems
    };
  });
    
  const seriesData = months.map((item: any) => item.qty);
  const additionalSeriesData = months.map((item: any) => item.value);
  const monsths = sourceData.map((item: any) => item.month);

  return this.areaChartOptions = {
    series: [
      {
        name: 'Itens vendidos (Quantidade)',
        data: seriesData,
      },
      {
        name: 'Valor total',
        data: additionalSeriesData,
      },
    ],
    chart: {
      fontFamily: 'inherit',
      foreColor: '#a1aab2',
      height: 300,
      type: 'area',
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 3,
    },
    stroke: {
      curve: 'smooth',
      width: '2',
    },
    colors: ['#398bf7', '#06d79c'],

    legend: {
      show: true,
      position: 'top', // Posição da legenda (pode ser 'top', 'bottom', 'left', 'right', 'inset', etc.)
      fontSize: '14px', // Tamanho da fonte da legenda
      labels: {
        colors: ['#398bf7', '#06d79c'], // Cores dos rótulos da legenda
      },
      markers: {
        fillColors: ['#398bf7', '#06d79c'], // Cores dos marcadores da legenda
      },
    },
    grid: {
      show: true,
      strokeDashArray: 0,
      borderColor: 'rgba(0,0,0,0.1)',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      type: 'category',
      categories: monsths,
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          formatter: function (val: any) {
            return val.toFixed(2); // Formata os valores do eixo Y como necessário
          },
        },
        title: {
          text: 'Quantidade',
        },
      },
      {
        seriesName: 'Valor em Reais',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          formatter: function (val: any) {
            return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // Formata os valores em Reais
          },
        },
        title: {
          text: 'Valor em Reais',
        },
      },
    ],
    tooltip: {
      theme: 'dark',
    },
  };
}

getLabelsForMonths() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const labels = [];

  for (let month = 0; month <= currentMonth; month++) {
    const date = new Date(currentYear, month, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    labels.push(`${monthName}`);
  }

  return labels;
}

}
