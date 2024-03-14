import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { MaterialModule } from 'src/app/material.module';
import { SalesByStatesModel } from 'src/app/models/sales-by-states.model';
import { SalesByStatesRepository } from 'src/app/repositories/sales-by-states.respository';
import { FiltersComponent } from '../components/filters/filters.component';
@Component({
  selector: 'app-sales-by-states',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule,NgForOf, FiltersComponent],

  templateUrl: './sales-by-states.component.html',
  styleUrls: ['./sales-by-states.component.css']
})
export class SalesByStatesComponent implements OnInit {
  chartInstance: echarts.ECharts;

  states: SalesByStatesModel;
  selectValue: number = 28;
  startDate: Date = new Date();
  endDate: Date = new Date();
  SALVAR_RESPOSTA: any;

  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string
  params: any;
  camposFiltro:any
  fontSize = 12;

  constructor(private repository: SalesByStatesRepository) {    
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
    }

    this.camposFiltro = [
      { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: true, id: "sellerName" },
      { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: true, id: "sellerType" },
      { label: 'Filtrar', placeholder: 'Filtrar', type: 'select', visivel: true, value:'thisMonth', options: [
        { label: 'Hoje', value: 'today' },
        { label: 'Semana', value: 'lastWeek' },
        { label: 'Mês', value: 'thisMonth' }
      ], id: 'dateSelector' },
      { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: this.startDate, id: "registerInitial" },
      { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: true, value: this.endDate, id: "registerFinal" },
    ];
  
  }

  applyFontSize() {
    this.obterDadosERenderizarGrafico();
  }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {

    this.repository.call(this.params).subscribe({
      next: resp => {
        const stateMap: { [key: string]: string } = {
          'AC': 'Acre',
          'AL': 'Alagoas',
          'AP': 'Amapá',
          'AM': 'Amazonas',
          'BA': 'Bahia',
          'CE': 'Ceará',
          'DF': 'Distrito Federal',
          'ES': 'Espírito Santo',
          'GO': 'Goias',
          'MA': 'Maranhão',
          'MT': 'Mato Grosso',
          'MS': 'Mato Grosso do Sul',
          'MG': 'Minas Gerais',
          'PA': 'Pará',
          'PB': 'Paraíba',
          'PR': 'Paraná',
          'PE': 'Pernambuco',
          'PI': 'Piauí',
          'RJ': 'Rio de Janeiro',
          'RN': 'Rio Grande do Norte',
          'RS': 'Rio Grande do Sul',
          'RO': 'Rondônia',
          'RR': 'Roraima',
          'SC': 'Santa Catarina',
          'SP': 'São Paulo',
          'SE': 'Sergipe',
          'TO': 'Tocantins',
        };

        this.states = resp;

        const data = this.states.items.map(item => ({
          name: stateMap[item.uf] || item.uf,
          value: item.value
        }));
  
        this.executarMapa(data);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  transformData(states: any) {
    const dataTable: (string | number)[][] = [
      ['Estado', 'Quantidade']
    ];

    states.forEach((item: { uf: string | number; qty: string | number; }) => {
      dataTable.push([item.uf, item.qty]);
    });
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
    this.obterDadosERenderizarGrafico()
  }

  

  executarMapa(data: any): void {
    const primeiroElemento = data[0];
    this.chartInstance = echarts.init(document.getElementById('map'));

    this.chartInstance.showLoading();

    fetch('../../../../assets/BR.json')
      .then(response => response.json())
      .then(brasilJson => {
        this.chartInstance.hideLoading();
        

        echarts.registerMap('Brasil', brasilJson);
console.log('Dados de ' + this.params.registerInitial + ' até ' + this.params.registerFinal,)
        const option: EChartsOption = {
          title: {
            text: 'Vendas por Estado do Brasil',
            subtext: 'Dados de ' + format(new Date(this.params.registerInitial), 'dd/MM/yyyy') + ' até ' + format(new Date(this.params.registerFinal), 'dd/MM/yyyy'),
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            //formatter: '{b}: {c}'
          },
          visualMap: {
            max: primeiroElemento.value,
            text: ['Alta', 'Baixa'],
            realtime: false,
            calculable: true,
            inRange: {
              color: ["#ff9c32","#f9f452", '#ffff00', '#23d600'] // De verde claro (#e6fffa) para amarelo (#ffff00) para vermelho escuro (#ff0000)
            }
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              name: 'Vendas por Estado',
              type: 'map',
              map: 'Brasil',
              roam: true,
              label: {
                show: true,
                formatter: function(params) {
                  const value = (typeof params.value === 'number' || typeof params.value === 'string') ? parseFloat(params.value.toString()) : undefined;
                  if (value !== undefined && !isNaN(value)) {
                    const valueFormatted = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    return `{b|${params.name}}\n{c|${valueFormatted}}`; // Utilizando formatação para nome e valor
                  } else {
                    return `{b|${params.name}}\n{c|${params.value}}`; // Utilizando o valor original se não for possível converter para número
                  }
                },
                rich: { // Definindo estilos personalizados
                  c: {
                    fontWeight: 'bold', // Negrito para o valor
                    fontSize: this.fontSize // Tamanho da fonte do valor (em pixels)
                  }
                }
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              data: data
            }
          ]
        };

        this.chartInstance.setOption(option);
      });
  }


}
