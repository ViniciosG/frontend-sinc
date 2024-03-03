import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { isEqual } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { option } from 'src/app/interfaces/options';
import { MaterialModule } from 'src/app/material.module';
import { ProductsSoldModel } from 'src/app/models/products-sold.model';
import { ProductsSoldsRepository } from 'src/app/repositories/products-sold.repository';

@Component({
  selector: 'app-products-sold',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './products-sold.component.html',
  styleUrls: ['./products-sold.component.css']
})
export class ProductsSoldComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  showValue: boolean = true;
  startDate: Date = new Date();
  endDate: Date = new Date();
  products: ProductsSoldModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string
  graficoIds: string[] = [];
  SALVAR_RESPOSTA: any;
  option: any;
  totalValue: string;
  selectValue: number = 5;

  options: option[] = [
    { value: 5, viewValue: '5' },
    { value: 10, viewValue: '10' },
    { value: 15, viewValue: '15' },
    { value: 20, viewValue: '20' },
    { value: 25, viewValue: '25' },
    { value: 30, viewValue: '30' },
  ];



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
  }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    this.repository.getProductsSold(this.date_inital, this.date_final, this.selectValue, "DESC", "value").subscribe({
      next: resp => {
        this.products = resp;
  
        if (!isEqual(this.SALVAR_RESPOSTA, this.products)) {
          takeUntil(this.destroy$)
          this.SALVAR_RESPOSTA = resp;
          const value = this.products.items.reduce((total, item) => total + item.value, 0);

          this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
          this.executar(this.products.items);

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
console.log(items)  
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
        data: items.map((item: any) => ({ value: item.productName, textStyle: { fontWeight: 'bold' } })) 
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
            y: 'productName' 
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
