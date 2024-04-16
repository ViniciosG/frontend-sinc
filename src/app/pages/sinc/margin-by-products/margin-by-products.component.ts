import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { MaterialModule } from 'src/app/material.module';
import { MarginByProductsModel } from 'src/app/models/margin-by-products.model';
import { MarginByProductsRepository } from 'src/app/repositories/margin-by-products.repository';
import { CoreService } from 'src/app/services/core.service';
import { FiltersComponent } from '../components/filters/filters.component';

@Component({
  selector: 'app-margin-by-products',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, FiltersComponent, TablerIconsModule],
  templateUrl: './margin-by-products.component.html',
  styleUrls: ['./margin-by-products.component.css']
})
export class MarginByProductsComponent implements AfterViewInit {

  @ViewChild('graficoEcharts', { static: false }) graficoEcharts: ElementRef<HTMLDivElement>;

  startDate: Date = new Date();
  endDate: Date = new Date();
  subGroups: MarginByProductsModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string;
  SALVAR_RESPOSTA: MarginByProductsModel;
  totalValue: string;
  params: any;
  camposFiltro: any
  carregandoDados: boolean = false;
  quantidadeVendas: string;
  quantidadeItems: string;
  margem: string;
  grafico: any;
  loading: boolean = false;
  options = this.settings.getOptions();
  mensagemNaTela: string = '';
  isVisible: boolean = true
  constructor(private repository: MarginByProductsRepository,
    private readonly elementRef: ElementRef,
    private cdref: ChangeDetectorRef,
    private settings: CoreService,) {
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
      registerFinal: this.date_final,
      _limit: 1000
    };

    this.camposFiltro = [
      {
        label: 'Filtrar', placeholder: 'Filtrar', type: 'select', visivel: true, value: 'thisMonth', options: [
          { label: 'Hoje', value: 'today' },
          { label: 'Semana', value: 'lastWeek' },
          { label: 'Mês', value: 'thisMonth' }
        ], id: 'dateSelector'
      },
      { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: this.startDate, id: "registerInitial" },
      { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: true, value: this.endDate, id: "registerFinal" },
      { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: true, id: "sellerName" },
      { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: true, id: "sellerType" },

    ];
    this.options.sidenavCollapsed = false;
    this.settings.setOptions(this.options);
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
    this.obterDadosERenderizarGrafico();
  }

  ngAfterViewInit(): void {
    this.grafico = this.elementRef.nativeElement.querySelector('#grafico-echarts');
    this.grafico.style.minHeight = '1px';
    this.obterDadosERenderizarGrafico();
    this.cdref.detectChanges()
  }

  obterDadosERenderizarGrafico() {
    this.loading = true;
    this.repository.call(this.params).subscribe({
      next: resp => {

        if (resp === null || resp === undefined) {
          this.isVisible = false
          this.graficoEcharts.nativeElement.style.display = 'none';
          this.mostrarMensagem('Não foi possível obter dados para os filtros aplicados.');
          this.loading = false;
          return; 
        } else {
          this.graficoEcharts.nativeElement.style.display = '';
          this.mostrarMensagem('');
        }

        this.SALVAR_RESPOSTA = resp;
        
        this.subGroups = { ...resp, items: [...resp.items] };

        const value = this.subGroups.items.reduce((total, item) => total + item.value, 0);
        this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.quantidadeVendas = this.subGroups.items.reduce((total, item) => total + item.qty, 0).toLocaleString('pt-BR');
        this.quantidadeItems = this.subGroups.items.reduce((total, item) => total + item.qtyItems, 0).toLocaleString('pt-BR');
        const lucro = this.subGroups.items.reduce((total, item) => total + (item.value * item.margin / 100), 0);
        this.margem = parseFloat(((lucro / value) * 100).toFixed(2)).toLocaleString('pt-BR');


        this.executar(this.subGroups.items, this.grafico);
        this.loading = false;
      },
      error: error => {
        console.error('Erro ao obter dados:', error);
        this.mostrarMensagem('Ocorreu um erro ao obter os dados. Por favor, tente novamente mais tarde.');
        this.loading = false;
      }
    });
  }

  mostrarMensagem(mensagem: string): void {
    this.mensagemNaTela = mensagem;
  }

  executar(items: any, graficoEcharts: HTMLElement): void {

    items.sort((a: any, b: any) => a.value - b.value);

    const tamanho = items.length * 75;
    graficoEcharts.style.minHeight = tamanho + 'px'

    const opcoes: echarts.EChartsOption = {
      dataset: {
        source: items
      },
      grid: {
        containLabel: true,
        left: 0,
        right: '25%' 
      },
      responsive: true,
      animation: false,
      xAxis: [{
        name: 'Valor',
        axisLabel: {
          formatter: (value: number) => {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          }
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
        data: items.map((item: any) => ({ value: item.productName, textStyle: { fontWeight: 'bold', color: 'black', } })),
        axisLabel: {
          formatter: function (value: string) {
            const maxCharactersPerLine = 11;
            const lines = [];
            let index = 0;
            for (let i = 0; i < value.length; i++) {
              if (i > (maxCharactersPerLine * (lines.length + 1)) && value[i] === ' ') {
                lines.push(value.substring(index, i));
                index = i
              }
            }
            if (value.length !== index +1){
              lines.push(value.substring(index, value.length));
            }
            return lines.join('\n');
          },
        },
      },
      series: [{
        type: 'bar',
        barWidth: '50px',
        encode: {
          x: 'value',
          y: 'productName'
        },
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => {
            const value = params.value.value;
            const quantidade = params.value.qty;
            const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            return `{a|${formattedValue}}\n{b|Margem: ${params.value.margin}}%\n{c|Vendas: ${quantidade}}`;
          },
          rich: {
            a: {
              fontWeight: 'bold',
              color: 'black'
            },
            b: {
              color: '#999',
              lineHeight: 20
            },
            c: {
              color: '#999',
              lineHeight: 20
            }
          }
        }
      }],
    };
    const meuGrafico = echarts.init(graficoEcharts);
    meuGrafico.resize();
    meuGrafico.setOption(opcoes);
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
    if (elementoGrafico != null) {
      const meuGrafico = echarts.init(elementoGrafico);
      meuGrafico.resize();
    }

  }


}
