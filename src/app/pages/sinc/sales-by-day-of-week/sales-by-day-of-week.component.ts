import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { subDays } from 'date-fns';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { isEqual } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { SalesByDayOfWeekModel } from 'src/app/models/sales-by-day-of-week.model';
import { SalesByDayOfWeekRepository } from 'src/app/repositories/sales-by-day-of-week.repository';
import { FiltersComponent } from '../components/filters/filters.component';

@Component({
  selector: 'app-sales-by-day-of-week',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, FiltersComponent],
  templateUrl: './sales-by-day-of-week.component.html',
  styleUrls: ['./sales-by-day-of-week.component.css']
})
export class SalesByDayOfWeekComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  startDate: Date = new Date();
  endDate: Date = new Date();
  sales: SalesByDayOfWeekModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string;
  SALVAR_RESPOSTA: any;
  option: any;
  totalValue: string;
  selectValue: number = 5;
  params: any;


  // camposFiltro = [
  //   { label: 'Quantidade Itens', placeholder: 'Quantidade Itens', visivel: true },
  //   { label: 'Quantidade Vendas', placeholder: 'Quantidade Vendas', visivel: true },
  //   { label: 'Valor', placeholder: 'Valor', visivel: true },
  //   { label: 'Vendedor', placeholder: 'Vendedor', visivel: true },
  //   { label: 'Tipo Vendedor', placeholder: 'Tipo Vendedor', visivel: true }, 
  //   { label: 'Direção', placeholder: 'Direção', visivel: true },
  //   { label: 'Data Inicial', placeholder: 'Data Inicial', visivel: true },
  //   { label: 'Data Final', placeholder: 'Data Final', visivel: true },
  //   { label: 'Campo', placeholder: 'Campo', visivel: true }, 
  //   { label: 'Limite', placeholder: 'Limite', visivel: true }, 

  // ];

  camposFiltro = [
    { label: 'Quantidade', placeholder: 'Quantidade', type: 'text', visivel: true, value: 5 },
    { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: new Date() },
    { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: true, value: new Date() },
    { label: 'Vendedor', placeholder: 'Selecione o vendedor', type: 'select', visivel: true, value: '', 
      options: [ 
        { value: 'vendedor1', viewValue: 'Vendedor 1' },
        { value: 'vendedor2', viewValue: 'Vendedor 2' },
        { value: 'vendedor3', viewValue: 'Vendedor 3' }
      ]
    }
    // Adicione os outros campos de filtro aqui conforme necessário
  ];

  constructor(private repository: SalesByDayOfWeekRepository) {
    const dataAtual = new Date();
  
    const dataSeteDiasAtras = subDays(dataAtual, 7);
  
    this.startDate = dataSeteDiasAtras;
    this.endDate = new Date();
  
    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
  
    this.inititalContext = format(this.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    this.endContext = format(this.endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
    }
  }
  

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  onFiltroAlterado(event: any) {
    console.log('Filtro alterado:', event.campo.label, 'Valor:', event.valor);
    
    this.params = {
      qtyItems: 5,
      qty: 10,
      value: 100,
      sellerName: 'Nome do vendedor',
      sellerType: 'Tipo do vendedor',
      _sort: 'dayOfWeek',
      _direction: 'ASC',
      registerInitial: '2024-02-25T13:53:23-03:00',
      registerFinal: '2024-03-03T13:53:23-03:00',
      _limit: 5
    };

    this.obterDadosERenderizarGrafico();

  }



  obterDadosERenderizarGrafico() {
    this.repository.getSalesByDaysWeek(this.params).subscribe({
      next: resp => {
        this.sales = resp;
  
        if (!isEqual(this.SALVAR_RESPOSTA, this.sales)) {
          takeUntil(this.destroy$)
          this.SALVAR_RESPOSTA = resp;
          const value = this.sales.items.reduce((total, item) => total + item.value, 0);

          this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
          this.executarGraficoBarras(this.sales.items);

        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  executarGraficoBarras(item: any): echarts.EChartsOption {
    // Ordena os dados pelo dia da semana de forma ascendente
    item.sort((a: any, b: any) => parseInt(a.dayOfWeek) - parseInt(b.dayOfWeek));
  
    const sourceData = item.map((data:any) => {
      return {
        dayOfWeek: this.numeroParaDiaDaSemana(parseInt(data.dayOfWeek)),
        value: data.value,
        qty: data.qty,
        qtyItems: data.qtyItems
      };
    });
  
    const option: echarts.EChartsOption = {
      title: {
        text: 'Vendas por Dia da Semana', // Título do gráfico
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
        name: 'Dia da Semana', // Rótulo do eixo X
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
          encode: { x: 'dayOfWeek', y: 'value' },
          label: {
            show: true,
            position: 'top',
            formatter: '\n💰' // Adiciona o emoji acima de cada barra
          } 
        },
        { 
          name: 'Qtd. Vendas', 
          type: 'bar', 
          encode: { x: 'dayOfWeek', y: 'qty' }, 
          yAxisIndex: 1,
          label: {
            show: true,
            position: 'top',
            formatter: '\n🛒' // Adiciona o emoji acima de cada barra
          }
        },
        { 
          name: 'Qtd. Itens', 
          type: 'bar', 
          encode: { x: 'dayOfWeek', y: 'qtyItems' }, 
          yAxisIndex: 1,
          label: {
            show: true,
            position: 'top',
            formatter: '\n📦' // Adiciona o emoji acima de cada barra
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
          pieToggle: { // Adicione um botão separado para alternar para tipo "pie"
            show: true,
            title: 'Exibir como pizza'
          }
        }
      }
    };
  
    const elementoGrafico = document.getElementById('grafico-echarts');
    if (elementoGrafico) {
      const meuGrafico = echarts.init(elementoGrafico);
      meuGrafico.setOption(option);
    }
  
    return option;
}

  
  

  numeroParaDiaDaSemana(numero: number): string {
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return diasDaSemana[numero - 1]; // Subtrai 1 porque os dias da semana normalmente começam em 0 (Domingo)
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
