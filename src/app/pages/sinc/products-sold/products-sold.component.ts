import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { isEqual } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ProductsSoldModel } from 'src/app/models/products-sold.model';
import { ProductsSoldsRepository } from 'src/app/repositories/products-sold.repository';
import { FiltersComponent } from '../components/filters/filters.component';

@Component({
  selector: 'app-products-sold',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule,FiltersComponent,TablerIconsModule],
  templateUrl: './products-sold.component.html',
  styleUrls: ['./products-sold.component.css']
})
export class ProductsSoldComponent implements OnInit {
  
  private destroy$: Subject<void> = new Subject<void>();

  startDate: Date = new Date();
  endDate: Date = new Date();
  productsSolds: ProductsSoldModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string;
  SALVAR_RESPOSTA: any;
  option: any;
  totalValue: string;
  quantidadeVendas: string;
  quantidadeItems:string;
  params: any;
  camposFiltro:any
  altura: any = 3000;

  constructor(private repository: ProductsSoldsRepository) {
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
      _offset: 0
    }

    this.camposFiltro = [
      { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: true, id: "sellerName" },
      { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: true, id: "sellerType" },
      { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: this.startDate, id: "registerInitial" },
      { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: true, value: this.endDate, id: "registerFinal" },
      { label: 'Filtrar', placeholder: 'Filtrar', type: 'select', visivel: true, value:'thisMonth', options: [
        { label: 'Hoje', value: 'today' },
        { label: 'Semana', value: 'lastWeek' },
        { label: 'Mês', value: 'thisMonth' }
      ], id: 'dateSelector' },
      
    ];
  }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  
  receberFiltros(event: any) {
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
    delete this.params['dateSelector'];
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {

    this.repository.call(this.params).subscribe({
      next: resp => {
        this.productsSolds = resp;
        this.altura = this.altura + this.productsSolds.returnedTotal * 31 + 200;
        this.atualizarGrafico();
        if (!isEqual(this.SALVAR_RESPOSTA, this.productsSolds)) {
          takeUntil(this.destroy$)
          this.SALVAR_RESPOSTA = resp;
          const value = this.productsSolds.items.reduce((total, item) => total + item.value, 0);

                    this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          this.quantidadeVendas = this.productsSolds.items.reduce((total, item) => total + item.qty, 0).toLocaleString('pt-BR');
          this.quantidadeItems = this.productsSolds.items.reduce((total, item) => total + item.qtyItems, 0).toLocaleString('pt-BR');
  
          this.executar(this.productsSolds.items);

        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  executar(items: any) {
    items.sort((a: any, b: any) => a.value - b.value);
    
    const opcoes: echarts.EChartsOption = {
      dataset: {
        source: items
      },
      grid: {
        containLabel: true,
        width: '80%', // Define a largura do gráfico como 80% do container
        height: '80%', // Define a altura do gráfico como 80% do container
      },
      xAxis: [{
        name: 'Valor',
        //type: 'value', 
        axisLabel: {
      formatter: (value: number) => {
          return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }        },
        axisLine: {
          lineStyle: {
            color: '#333'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
      }],
      yAxis: {
        type: 'category',
        data: items.map((item: any) => ({ value: item.productName, textStyle: { fontWeight: 'bold', color:'black' } })),
        axisLabel: {
          // interval: 0, // Exibir todos os rótulos do eixo y
          // margin: 10 // Margem entre os rótulos e o eixo
        }
      },
      series: [{
        type: 'bar',
        barWidth: 0,
        encode: {
          x: 'value',
          y: 'productName'
        },
        label: {
          show: true,
          position: 'right', // Colocar os rótulos à direita das barras
          formatter: (params: any) => {
            const value = params.value.value;
            const quantidade = params.value.qty;
            const quantidadeItens = params.value.qtyItems;
            const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            return `{a|${formattedValue}}\n{b|Vendas: ${quantidade}}\n{c|Itens: ${quantidadeItens}}`;
          },
          rich: {
            a: {
              fontWeight: 'bold',
              color: 'black'
            },
            b: {
              color: '#999',
              lineHeight: 20
            },
            c: {
              color: '#999',
              lineHeight: 20
            }
          }
        }
      }],
      darkMode: true
    };
  
    const elementoGrafico = document.getElementById('grafico-echarts');
    if (elementoGrafico) {
      const meuGrafico = echarts.init(elementoGrafico);
      meuGrafico.setOption(opcoes);
    }
  }
  

  

  onSelectChange(event: number) {
    this.obterDadosERenderizarGrafico();
  }

  onDateChangeInitial(event: any) {
    const novaData = event.value;
    if (novaData) {
      const dataFormatada = format(novaData, "yyyy-MM-dd'T'HH:mm:ssXXX");
      this.date_inital = dataFormatada
      this.inititalContext = format(novaData, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      this.obterDadosERenderizarGrafico();
    }
  }

  onDateChangeFinal(event: any) {
    const novaData = event.value;
    if (novaData) {
      const dataFormatada = format(novaData, "yyyy-MM-dd'T'HH:mm:ssXXX");
      this.date_final = dataFormatada
      this.endContext = format(novaData, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      this.obterDadosERenderizarGrafico();
    }
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return true;
    }
    const today = new Date();
    return date <= today;
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
