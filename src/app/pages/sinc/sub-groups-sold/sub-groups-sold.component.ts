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

  camposFiltro = [
    { label: 'Quantidade', placeholder: 'Quantidade', type: 'text', visivel: true, value: 5, id: "qty" },
    { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: new Date(), id: "registerInitial" },
    { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: true, value: new Date(), id: "registerFinal" },
    // Adicione os outros campos de filtro aqui conforme necessário
  ];

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
      grid: { containLabel: true },
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
        data: items.map((item: any) => ({ value: item.subGroupName, textStyle: { fontWeight: 'bold' } })) 
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
