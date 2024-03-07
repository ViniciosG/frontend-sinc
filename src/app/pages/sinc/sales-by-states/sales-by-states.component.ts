import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { Subject } from 'rxjs';
import { SalesByStatesModel } from 'src/app/models/sales-by-states.model';
import { SalesByStatesRepository } from 'src/app/repositories/sales-by-states.respository';
@Component({
  selector: 'app-sales-by-states',
  standalone: true,
  templateUrl: './sales-by-states.component.html',
  styleUrls: ['./sales-by-states.component.css']
})
export class SalesByStatesComponent implements OnInit {
  chartInstance: echarts.ECharts;
  private destroy$: Subject<void> = new Subject<void>();

  states: SalesByStatesModel;
  selectValue: number = 28;
  startDate: Date = new Date();
  endDate: Date = new Date();
  SALVAR_RESPOSTA: any;

  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string
  constructor(private repository: SalesByStatesRepository) {    
    const dataAtual = new Date();

    dataAtual.setDate(1);
    dataAtual.setHours(0, 0, 0, 0);

    this.startDate = dataAtual;

    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.inititalContext = format(this.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    this.endContext = format(this.endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }); }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {

    this.repository.getSalesByStates("2024-01-01T22:33:56-03:00", "2024-03-01T22:33:56-03:00", "DESC", "value").subscribe({
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

  

  executarMapa(data: any): void {
    const primeiroElemento = data[0];
    this.chartInstance = echarts.init(document.getElementById('map'));

    this.chartInstance.showLoading();

    fetch('../../../../assets/BR.json')
      .then(response => response.json())
      .then(brasilJson => {
        this.chartInstance.hideLoading();
        

        echarts.registerMap('Brasil', brasilJson);

        const option: EChartsOption = {
          title: {
            text: 'Vendas por Estado do Brasil',
            subtext: 'Dados de ' + this.inititalContext + ' até ' + this.endContext,
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
                formatter: '{b}'
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
