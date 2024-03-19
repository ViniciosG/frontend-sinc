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
import { NewCustomersPerMonthModel } from 'src/app/models/new-customers-per-month.model';
import { NewCustomersPerMonthsRepository } from 'src/app/repositories/new-customers.per-month.repository';
import { FiltersComponent } from '../components/filters/filters.component';

@Component({
  selector: 'app-new-customers-per-month',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule,FiltersComponent,TablerIconsModule],

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
  quantidadeClientes: string;
  params: any;
  camposFiltro:any
  totalValue: string;

  constructor(private repository: NewCustomersPerMonthsRepository) {
    const dataAtual = new Date();

    dataAtual.setFullYear(new Date().getFullYear(), 0, 1); // Janeiro é representado por 0
    dataAtual.setHours(0, 0, 0, 0); // Define o horário para 00:00:00

    this.startDate = dataAtual;

    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.selectValue = dataAtual.getFullYear()

    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
    }

    const anoAtual = new Date().getFullYear();
    const listaAnos = Array.from({ length: anoAtual - 2008 + 1 }, (_, index) => (2008 + index).toString());

    this.camposFiltro = [
      { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: true, id: "sellerName" },
      { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: true, id: "sellerType" },
      { label: 'Ranking', placeholder: 'Ranking', type: 'select',value: '12', visivel: false, options: ['5', '10', '20','30'], id: "_limit" },
      { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: this.startDate, id: "registerInitial" },
      { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: true, value: this.endDate, id: "registerFinal" },
      { 
        label: 'Ano', 
        placeholder: 'Ano', 
        type: 'select', 
        visivel: true, 
        value: anoAtual.toString(), 
        options: listaAnos.map(ano => ({ label: ano, value: ano })) 
        , id: 'yearSelecetor' 
      },
      
    ];
  }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.customers = resp;

        this.quantidadeClientes = this.customers.items.reduce((total, item) => total + item.qty, 0).toLocaleString('pt-BR');

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

  executar(item: any) {
    
    const months = item.map((data: any) => {
        const [month, year] = data.month.split('/');
        const monthName = format(new Date(Number(year), Number(month) - 1), 'MMMM', { locale: ptBR });
        return monthName;
    });
    const quantities = item.map((data: any) => data.qty);
    
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
                type: 'bar', // Tipo de gráfico: barras
                data: quantities, // Usar as quantidades como dados da série
                label: {
                    show: true, // Mostrar rótulos
                    position: 'top',     
                    formatter: (params: any) => {
                        const valueFormatted = params.value.toLocaleString();
                        return `{a|${valueFormatted}} 👥`; // Usando formatação de texto enriquecido
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
