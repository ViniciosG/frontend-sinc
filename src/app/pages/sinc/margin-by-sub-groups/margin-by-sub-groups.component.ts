import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
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
  camposFiltro:any

  constructor(private repository: MarginBySubGroupsRepository) {
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
      _sort: "value",
      _direction: "DESC",
      registerFinal:  this.date_final,
    };

    this.camposFiltro = [
      { label: 'Filtrar', placeholder: 'Filtrar', type: 'select', visivel: true, value:'thisMonth', options: [
        { label: 'Hoje', value: 'today' },
        { label: 'Semana', value: 'lastWeek' },
        { label: 'Mês', value: 'thisMonth' }
      ], id: 'dateSelector' },
      { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: this.startDate, id: "registerInitial" },
      { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: true, value: this.endDate, id: "registerFinal" },
      { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: true, id: "sellerName" },
      { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: true, id: "sellerType" },

    ];
  }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  receberFiltros(event: any) {
  
    this.camposFiltro.forEach((campo:any) => {

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
    this.obterDadosERenderizarGrafico();
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
      series: [
        {
          type: 'bar',
          barWidth: 0,
          encode: {
            x: 'margin',
            y: 'subGroupName'
          },
          itemStyle: { 
            color: (params: any) => {
              const valorMargem = params.value.margin;
              return valorMargem < 0 ? '#FD665F' : '#65B581';
            }
          },
          label: {
            show: true,
            position: 'insideRight', 
            formatter: (params: any) => {
              const value = params.value.margin;
              return `{a|${value}%}`; 
            },
            rich: {
              a: {
                fontWeight: 'bold',
                color: 'white' 
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
