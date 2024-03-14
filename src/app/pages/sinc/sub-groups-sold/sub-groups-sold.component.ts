import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { isEqual } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { SubGroupSoldModel } from 'src/app/models/sub-group-sold.model';
import { SubGroupSoldRepository } from 'src/app/repositories/sub-group-sold.repository';
import { FiltersComponent } from '../components/filters/filters.component';

@Component({
  selector: 'app-sub-groups-sold',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule,FiltersComponent],
  templateUrl: './sub-groups-sold.component.html',
  styleUrls: ['./sub-groups-sold.component.css']
})
export class SubGroupsSoldComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();

  startDate: Date = new Date();
  endDate: Date = new Date();
  subGroups: SubGroupSoldModel;
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



  constructor(private repository: SubGroupSoldRepository) {
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
      _limit: 5
    }

    this.camposFiltro = [
      { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: true, id: "sellerName" },
      { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: true, id: "sellerType" },
      { label: 'Ranking', placeholder: 'Ranking', type: 'select',value: '5', visivel: true, options: ['5', '10', '20','30'], id: "_limit" },
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
    delete this.params['dateSelector'];
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.subGroups = resp;
  
        if (!isEqual(this.SALVAR_RESPOSTA, this.subGroups)) {
          takeUntil(this.destroy$)
          this.SALVAR_RESPOSTA = resp;
          const value = this.subGroups.items.reduce((total, item) => total + item.value, 0);

          this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
          this.executar(this.subGroups.items);

        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  executar(items: any) {
    items.sort((a: any, b: any) => a.value - b.value);

    const ultimoElemento = items[items.length - 1];
  
    const opcoes: echarts.EChartsOption = {
      dataset: {
        source: items
      },
      grid: {
        containLabel: true,
        left: 10,
        right: 10,
        top: 50,
        bottom: 10
      },
      xAxis: [{
        name: 'Valor',
        //type: 'value', 
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
        axisLabel: {
          interval: 0, // Exibir todos os rótulos do eixo y
          margin: 10 // Margem entre os rótulos e o eixo
        }
      },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        max: ultimoElemento.value,
        text: ['Alto valor', 'Baixo valor'],
        dimension: 2,
        inRange: {
          color: ['#FD665F', '#FFCE34', '#65B581']
        }
      },
      series: [
        {
          type: 'bar',
          barWidth: 0, 
          encode: {
            x: 'value', 
            y: 'subGroupName' 
          },
          
          label: {  
            show: true,
            position: 'insideRight',
            formatter: (params: any) => {
              const value = params.value.value;
              const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              return `{a|${formattedValue}}`; 
            },
            rich: {
              a: {
                fontWeight: 'bold',
                color: 'black' 
              }
            }          
          }
          
        }
      ],
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
