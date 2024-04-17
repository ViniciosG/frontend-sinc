import { CommonModule, NgForOf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('graficoEcharts', { static: false }) graficoEcharts: ElementRef<HTMLDivElement>;

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
  fontSize = 10;
  mensagemNaTela: string = '';
  isVisible: boolean = true
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

  mostrarMensagem(mensagem: string): void {
    this.mensagemNaTela = mensagem;
  }

  obterDadosERenderizarGrafico() {

    this.repository.call(this.params).subscribe({
      next: resp => {
        if (resp === null || resp === undefined) {
          this.isVisible = false
          this.mostrarMensagem('Não foi possível obter dados para os filtros aplicados.');
          return; 
        } else {
          this.isVisible = true
          this.mostrarMensagem('');
        }
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

        const allStatesData = Object.keys(stateMap).map(uf => {
          const stateData = this.states.items.find(item => item.uf === uf);
          return {
            name: stateMap[uf],
            value: stateData ? stateData.value : 0,
            qty: stateData ? stateData.qty : 0, 
            qtyItems: stateData ? stateData.qtyItems : 0 
          };
        });
  
        this.executarMapa(allStatesData);
      },
      error: error => {
        this.isVisible = false
        this.graficoEcharts.nativeElement.style.display = 'none';
        this.mostrarMensagem('Não foi possível obter os dados.');
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
    delete this.params['dateSelector'];
    this.obterDadosERenderizarGrafico()
  }

  

  executarMapa(data: any): void {
    const maxValor = Math.max(...data.map((item:any) => item.value));
    this.chartInstance = echarts.init(document.getElementById('map'));

    this.chartInstance.showLoading();

    fetch('assets/BR.json')
      .then(response => response.json())
      .then(brasilJson => {
        this.chartInstance.hideLoading();
        

        echarts.registerMap('Brasil', brasilJson);
        const option: EChartsOption = {
          title: {
            text: 'Vendas por Estado do Brasil',
            subtext: 'Dados de ' + format(new Date(this.params.registerInitial), 'dd/MM/yyyy') + ' até ' + format(new Date(this.params.registerFinal), 'dd/MM/yyyy'),
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
          },
          visualMap: {
            max: maxValor,
            text: ['Alta', 'Baixa'],
            realtime: false,
            calculable: true,
            inRange: {
              color: ["#ff9c32","#f9f452", '#ffff00', '#23d600'] 
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
                formatter(params:any) {
                      // Extrair os valores das propriedades
                      const { qty, qtyItems } = params.data;
                
                      const qtyString = `${qty}`
                      const qtyItemsString = `${qtyItems}`
                
                      const valueFormated = (typeof params.value === 'number' || typeof params.value === 'string') ? parseFloat(params.value.toString()) : undefined;
                                  
                      if (valueFormated !== undefined && valueFormated != null) {
                        const valueFormatted = valueFormated?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        const formattedLabel = `{c|${params.name}}\n{c|${valueFormatted}}\n{b|Vendas: ${qtyString}}\n{b|Qtd Itens: ${qtyItemsString}}`;
                        return formattedLabel;
                      } else {
                        return `{b|${params.name}}\n{c|${params.value}}`;
                      }
                },
                rich: {
                  c: {
                    fontWeight: 'bold',
                    fontSize: this.fontSize 
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
