import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { isEqual } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { SalesByMonthModel } from 'src/app/models/sales-by-month.model';
import { SalesByMonthRepository } from 'src/app/repositories/sales-by-month.repository';

@Component({
  selector: 'app-sales-by-month',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './sales-by-month.component.html',
  styleUrls: ['./sales-by-month.component.css']
})
export class SalesByMonthComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();

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

  constructor(private repository: SalesByMonthRepository) {
    const dataAtual = new Date();
    dataAtual.setDate(1);
    dataAtual.setHours(0, 0, 0, 0);
    dataAtual.setFullYear(new Date().getFullYear(), 0, 1);


    this.startDate = dataAtual;

    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.selectValue = dataAtual.getFullYear()
  }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    this.repository.getSalesByMonth(this.date_inital, this.date_final).subscribe({
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
    item.sort((a: any, b: any) => parseInt(a.month) - parseInt(b.month));
  
    const sourceData = item.map((data:any) => {
      return {
        month: this.numeroParaMes(parseInt(data.month)),
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
          encode: { x: 'month', y: 'value' },
          label: {
            show: true,
            position: 'top',
            formatter: '\n💰' // Adiciona o emoji acima de cada barra
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
            formatter: '\n🛒' // Adiciona o emoji acima de cada barra
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

numeroParaMes(numero: number): string {
  const data = parse(`${numero}/2024`, 'MM/yyyy', new Date());
  return format(data, 'MMMM', { locale: ptBR });
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
