import { Component, HostListener, OnInit } from '@angular/core';
import { format } from 'date-fns';
import * as echarts from 'echarts';
import { isEqual } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { option } from 'src/app/interfaces/options';
import { NewCustomersPerMonthModel } from 'src/app/models/new-customers-per-month.model';
import { NewCustomersPerMonthsRepository } from 'src/app/repositories/new-customers.per-month.repository';

@Component({
  selector: 'app-new-customers-per-month',
  standalone: true,
  templateUrl: './new-customers-per-month.component.html',
  styleUrls: ['./new-customers-per-month.component.css']
})
export class NewCustomersPerMonthComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();
  
  showValue: boolean = true;
  startDate: Date = new Date();
  endDate: Date = new Date();
  customers: NewCustomersPerMonthModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string
  graficoIds: string[] = [];
  SALVAR_RESPOSTA: any;
  selectValue: number;

  options: option[] = [
    { value: 2021, viewValue: '2021' },
    { value: 2022, viewValue: '2022' },
    { value: 2023, viewValue: '2023' },
    { value: 2024, viewValue: '2024' },
  ];


  constructor(private repository: NewCustomersPerMonthsRepository) {
    const dataAtual = new Date();

    // Define a data para 01 de janeiro do ano atual
    dataAtual.setFullYear(new Date().getFullYear(), 0, 1); // Janeiro é representado por 0
    dataAtual.setHours(0, 0, 0, 0); // Define o horário para 00:00:00

    // Atribua a data resultante à variável startDate
    this.startDate = dataAtual;

    // Atribua a data atual à variável endDate
    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.selectValue = dataAtual.getFullYear()
  }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    this.repository.getNewCustomersMonth(this.date_inital, this.date_final).subscribe({
      next: resp => {
        this.customers = resp;
  
        if (!isEqual(this.SALVAR_RESPOSTA, this.customers)) {
          takeUntil(this.destroy$)
          this.SALVAR_RESPOSTA = resp;
          const sortedItems = this.customers.items.sort((a, b) => a.month.localeCompare(b.month));
          this.executar(sortedItems);
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  executar(item: any) {
    // Extrair os meses e quantidades do item
    const months = item.map((data: any) => data.month);
    const quantities = item.map((data: any) => data.qty);
  
    // Configurar a opção do gráfico com os dados extraídos
    const option: echarts.EChartsOption = {
      title: {
        text: 'Quantidade por Mês'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data: months // Usar os meses como dados do eixo X
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}' // Não precisa de formatação específica para a quantidade
        }
      },
      series: [
        {
          name: 'Clientes',
          type: 'line', // Tipo de gráfico: linha
          data: quantities // Usar as quantidades como dados da série
        }
      ],
      darkMode: true
    };
  
    // Renderizar o gráfico com as opções configuradas
    const elementoGrafico = document.getElementById('grafico-echarts');
    if (elementoGrafico) {
      const meuGrafico = echarts.init(elementoGrafico);
      meuGrafico.setOption(option);
    }
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

}
