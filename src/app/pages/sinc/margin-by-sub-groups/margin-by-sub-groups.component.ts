import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format, startOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { isEqual } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { MarginBySubGroupsModel } from 'src/app/models/margin-by-sub-groups.model';
import { MarginBySubGroupsRepository } from 'src/app/repositories/margin-by-sub-groups.repository';
import { FiltersComponent } from '../components/filters/filters.component';

@Component({
  selector: 'app-margin-by-sub-groups',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule,FiltersComponent],
  templateUrl: './margin-by-sub-groups.component.html',
  styleUrls: ['./margin-by-sub-groups.component.css']
})
export class MarginBySubGroupsComponent implements OnInit {


  private destroy$: Subject<void> = new Subject<void>();

  startDate: Date = new Date();
  endDate: Date = new Date();
  marginSubGroups: MarginBySubGroupsModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string;
  SALVAR_RESPOSTA: any;
  option: any;
  totalValue: string;
  selectValue: number = 5;
  params: any;

  camposFiltro = [
    { label: 'Quantidade', placeholder: 'Quantidade', type: 'text', visivel: true, value: 5, id: "qty" },
    { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: new Date(), id: "registerInitial" },
    { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: true, value: new Date(), id: "registerFinal" },
  ];

  constructor(private repository: MarginBySubGroupsRepository) {
    const dataAtual = new Date();
    const primeiroDiaMesPassado = startOfMonth(subMonths(dataAtual, 1));
  
    this.startDate = primeiroDiaMesPassado;
    this.endDate = new Date();
  
    this.date_inital = format(primeiroDiaMesPassado, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
  
    this.inititalContext = format(primeiroDiaMesPassado, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    this.endContext = format(this.endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
    this.params = {
      registerInitial: this.date_inital,
      _sort: "margin",
      _direction: "DESC",
      registerFinal:  this.date_final,
      _limit: 10
    };
  }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  receberFiltros(event: any) {
    console.log('Filtros recebidos:', event);
  
    this.camposFiltro.forEach(campo => {

      if (campo.id && campo.value !== undefined) {

        if (campo.type === 'date') {

          const dataFormatada = format(campo.value, "yyyy-MM-dd'T'HH:mm:ssXXX");

          this.params[campo.id] = dataFormatada;
        } else {
          this.params[campo.id] = campo.value;
        }
      }
    });
  
    console.log('Params atualizado:', this.params);
  }

  obterDadosERenderizarGrafico() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.marginSubGroups = resp;
  
        if (!isEqual(this.SALVAR_RESPOSTA, this.marginSubGroups)) {
          takeUntil(this.destroy$)
          this.SALVAR_RESPOSTA = resp;
          const value = this.marginSubGroups.items.reduce((total, item) => total + item.value, 0);

          this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
          this.executar(this.marginSubGroups.items);

        }
      },
      error: error => {
        console.log(error);
      }
    });
  }



  executar(items: any) {
    
    items.sort((a: any, b: any) => a.margin - b.margin);


    const opcoes: echarts.EChartsOption = {
      dataset: {
        source: items
      },
      title: {
        text: 'Margem por Sub Grupos'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },

      xAxis: [{
        name: 'Porcentagem',
        type: 'value', 
        axisLabel: {
          formatter: (value: number) => value.toFixed(2) 
        },
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
        data: items.map((item: any) => ({ value: item.subGroupName, textStyle: { fontWeight: 'bold' } })),
      },
      // visualMap: {
      //   orient: 'horizontal',
      //   left: 'center',
      //   //min: primeiroElemento.margin,
      //   max: ultimoElemento.margin,
      //   text: ['Baixo valor','Alto valor'],
      //   dimension: 2,
      //   inRange: {
      //     color: ['#FD665F',, '#FFCE34', '#65B581'] // Troquei a ordem das cores
      //   }
      // },
      series: [
        {
          type: 'bar',
          barWidth: 0,
          encode: {
            x: 'margin',
            y: 'subGroupName'
          },
          itemStyle: { // Adicionando estilo das barras
            color: (params: any) => {
              const valorMargem = params.value.margin;
              return valorMargem < 0 ? '#FD665F' : '#65B581'; // Verifica se o valor da margem é negativo
            }
          },
          label: { // Adicionando label para inserir o valor do eixo x dentro da barra
            show: true,
            position: 'insideRight', // Posição do valor dentro da barra
            formatter: (params: any) => {
              const value = params.value.margin;
              return `{a|${value}%}`; // Usando formatação de texto enriquecido
            },
            rich: {
              a: {
                fontWeight: 'bold',
                color: 'white' // Alterando a cor da fonte
              }
            }
          }
        }
      ],
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
