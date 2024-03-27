import { Component, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { SalesByMonthModel } from 'src/app/models/sales-by-month.model';
import { SalesByMonthRepository } from 'src/app/repositories/sales-by-month.repository';
import { MaterialModule } from '../../../material.module';

export interface employeeChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
}

@Component({
  selector: 'app-employee-salary',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './employee-salary.component.html',
})
export class AppEmployeeSalaryComponent {
  
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public employeeChart!: Partial<employeeChart> | any;
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

    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
    };

    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.sales = resp;

          const value = this.sales.items.reduce((total, item) => total + item.value, 0);
          
          this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          this.quantidadeVendas = this.sales.items.reduce((total, item) => total + item.qty, 0).toLocaleString('pt-BR');
          this.quantidadeItems = this.sales.items.reduce((total, item) => total + item.qtyItems, 0).toLocaleString('pt-BR');
  
          this.executar(this.sales.items);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  numeroParaMes(numero: number): string {
    const data = parse(`${numero}/2024`, 'MM/yyyy', new Date());
    return format(data, 'MMMM', { locale: ptBR });
  }

  executar(items: any) {
    items.sort((a: any, b: any) => parseInt(a.month) - parseInt(b.month));

    const sourceData = items.map((data: any) => {
      return {
        month: this.numeroParaMes(parseInt(data.month)),
        value: parseFloat(data.value), // Convertendo para número
        qty: data.qty,
        qtyItems: data.qtyItems
      };
    });
  
    // Mapeie os valores de sourceData para um array separado
    const values = sourceData.map((item:any) => item.value);
  
    this.employeeChart = {
      series: [
        {
          name: '',
          data: values, // Usando os valores mapeados aqui
        },
      ],
      chart: {
        type: 'bar',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 270,
      },
      colors: [
        '#ECF2FF',
        '#ECF2FF',
        '#5D87FF',
        '#ECF2FF',
        '#ECF2FF',
        '#ECF2FF',
      ],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '30%',
          distributed: true,
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        categories: sourceData.map((item:any) => item.month), // Usando os meses como categorias
        axisBorder: {
          show: false,
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
      tooltip: {
        theme: 'dark',
        formatter: function (val: any) {
          return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) // Usar o valor formatado como BRL
        }
      },
    };
  }
  
}
