import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { startOfWeek } from 'date-fns';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { isEqual } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { SalesByDayOfWeekModel } from 'src/app/models/sales-by-day-of-week.model';
import { SalesByDayOfWeekRepository } from 'src/app/repositories/sales-by-day-of-week.repository';
import { CoreService } from 'src/app/services/core.service';
import { FiltersComponent } from '../components/filters/filters.component';

@Component({
  selector: 'app-sales-by-day-of-week',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, FiltersComponent,TablerIconsModule],
  templateUrl: './sales-by-day-of-week.component.html',
  styleUrls: ['./sales-by-day-of-week.component.css']
})
export class SalesByDayOfWeekComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  @ViewChild('graficoEcharts', { static: false }) graficoEcharts: ElementRef<HTMLDivElement>;

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
  quantidadeVendas: string;
  quantidadeItems:string;
  selectValue: number = 5;
  params: any;
  camposFiltro:any;
  legendStateInitialized = false;
  loading: boolean = false;
  options = this.settings.getOptions();
  mensagemNaTela: string = '';
  isVisible: boolean = true
  constructor(private repository: SalesByDayOfWeekRepository,private settings: CoreService,) {
    const dataAtual = new Date();
    const primeiroDiaSemana = startOfWeek(dataAtual, { weekStartsOn: 0 }); // 0 para domingo, 1 para segunda, e assim por diante
    
    this.startDate = primeiroDiaSemana;
    this.endDate = new Date();
    
    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    
    this.inititalContext = format(this.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    this.endContext = format(this.endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
    this.camposFiltro = [
      { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: true, id: "sellerName" },
      { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: true, id: "sellerType" },
      { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: this.startDate, id: "registerInitial" },
      { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: true, value: this.endDate, id: "registerFinal" },

    ];

    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
    };
    this.options.sidenavCollapsed = false;
    this.settings.setOptions(this.options);
  }
  

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  receberFiltros(event: any) {
    console.log(event)
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
    this.obterDadosERenderizarGrafico()
  }



  obterDadosERenderizarGrafico() {
    this.loading = true;
    this.repository.call(this.params).subscribe({
      next: resp => {
        if (resp === null || resp === undefined) {
          this.isVisible = false
          this.mostrarMensagem('Não foi possível obter dados para os filtros aplicados.');
          this.loading = false;
          return; 
        } else {
          this.isVisible = true
          this.mostrarMensagem('');
        }
        this.loading = false;
        this.sales = resp;
  
        if (!isEqual(this.SALVAR_RESPOSTA, this.sales)) {
          takeUntil(this.destroy$)
          this.SALVAR_RESPOSTA = resp;
          const value = this.sales.items.reduce((total, item) => total + item.value, 0);

          this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          this.quantidadeVendas = this.sales.items.reduce((total, item) => total + item.qty, 0).toLocaleString('pt-BR');
          this.quantidadeItems = this.sales.items.reduce((total, item) => total + item.qtyItems, 0).toLocaleString('pt-BR');

          this.executarGraficoBarras(this.sales.items);

        }
      },
      error: error => {
        this.isVisible = false
        this.graficoEcharts.nativeElement.style.display = 'none';
        this.mostrarMensagem('Não foi possível obter os dados.');
        this.loading = false;
        console.log(error);
      }
    });
  }
  mostrarMensagem(mensagem: string): void {
    this.mensagemNaTela = mensagem;
  }
  executarGraficoBarras(item: any): echarts.EChartsOption {
    
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
        left: '50%', // Centraliza o título horizontalmente
        textAlign: 'center', // Alinha o texto ao centro
    },
      legend: {
        data: ['Valor', 'Qtd. Vendas', 'Qtd. Itens'],
        top: 'auto',
        bottom: 0,
        height: 'auto'
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
      responsive: true,
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
              return `{a|${valueFormatted}} 💰`; 
            },
            rich: {
              a: {
                fontWeight: 'bold',
                color: 'black'
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
            type: ['line', 'bar'], 
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
