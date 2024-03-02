import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-products-sold',
  standalone: true,
  templateUrl: './products-sold.component.html',
  styleUrls: ['./products-sold.component.css']
})
export class ProductsSoldComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    // Dados fictícios para teste
    const dados = [
      {"Ano": 1950, "País": "PN 175/70R14 SAILUN ATREZZO SH406 84T", "Renda": 5000},
      {"Ano": 1950, "País": "PN 195/60R15 GALLANT GL-16 88H", "Renda": 5500},
      {"Ano": 1951, "País": "PN 175/70R14 SAILUN ATREZZO SH406 84T", "Renda": 6000},
      {"Ano": 1951, "País": "PN 195/60R15 GALLANT GL-16 88H", "Renda": 4000,},
      {"Ano": 1952, "País": "PN 175/70R14 SAILUN ATREZZO SH406 84T", "Renda": 7000},
      {"Ano": 1952, "País": "PN 195/60R15 GALLANT GL-16 88H", "Renda": 8500},
      {"Ano": 1953, "País": "PN 175/70R14 SAILUN ATREZZO SH406 84T", "Renda": 6500},
      {"Ano": 1953, "País": "PN 195/60R15 GALLANT GL-16 88H", "Renda": 9000},
      {"Ano": 1954, "País": "PN 175/70R14 SAILUN ATREZZO SH406 84T", "Renda": 6500},
      {"Ano": 1954, "País": "PN 195/60R15 GALLANT GL-16 88H", "Renda": 7000},
      {"Ano": 1955, "País": "PN 175/70R14 SAILUN ATREZZO SH406 84T", "Renda": 10000},
      {"Ano": 1955, "País": "PN 195/60R15 GALLANT GL-16 88H", "Renda": 9900}
    ];

    this.executar(dados);
  }

  executar(dados: any) {
    const paises = [
      'PN 195/60R15 GALLANT GL-16 88H',
      'PN 175/70R14 SAILUN ATREZZO SH406 84T',
    ];

    const datasetWithFilters: echarts.DatasetComponentOption[] = [];
    const seriesList: echarts.SeriesOption[] = [];

    paises.forEach(pais => {
      const idConjDados = 'dados_' + pais;
      datasetWithFilters.push({
        id: idConjDados,
        fromDatasetId: 'conjDadosBrutos',
        transform: {
          type: 'filter',
          config: {
            and: [
              { dimension: 'Ano', gte: 1950 },
              { dimension: 'País', '=': pais }
            ]
          }
        }
      });
      console.log(pais)
      seriesList.push({
        type: 'line',
        datasetId: idConjDados,
        showSymbol: false,
        name: pais,
        endLabel: {
          show: true,
          formatter: (params: any) => {
           console.log(params)
            return params.data['País'] + ': ' + params.data['Renda'];
          }
        },
        labelLayout: {
          moveOverlap: 'shiftY'
        },
        emphasis: {
          focus: 'series'
        },
        encode: {
          x: 'Ano',
          y: 'Renda',
          label: ['País', 'Renda'],
          itemName: 'Ano',
          tooltip: ['Renda']
        }
      });
    });

    const opcoes: echarts.EChartsOption = {
      animationDuration: 8000,
      dataset: [
        {
          id: 'conjDadosBrutos',
          source: dados
        },
        ...datasetWithFilters
      ],
      title: {
        text: 'Renda da Alemanha e França desde 1950'
      },
      tooltip: {
        order: 'valueDesc',
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle'
      },
      yAxis: {
        name: 'Renda'
      },
      grid: {
        right: 140
      },
      series: seriesList
    };

    const elementoGrafico = document.getElementById('grafico-echarts');
    if (elementoGrafico) {
      const meuGrafico = echarts.init(elementoGrafico);
      meuGrafico.setOption(opcoes);
    }
  }

}
