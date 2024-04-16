import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as echarts from 'echarts';
import { MaterialModule } from 'src/app/material.module';
import { SubGroupSoldModel } from 'src/app/models/sub-group-sold.model';
import { SubGroupSoldRepository } from 'src/app/repositories/sub-group-sold.repository';
import { CoreService } from 'src/app/services/core.service';
import { FiltersComponent } from '../components/filters/filters.component';

@Component({
  selector: 'app-sub-groups-sold',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, FiltersComponent, TablerIconsModule],
  templateUrl: './sub-groups-sold.component.html',
  styleUrls: ['./sub-groups-sold.component.css']
})
export class SubGroupsSoldComponent implements AfterViewInit {
  startDate: Date = new Date();
  endDate: Date = new Date();
  subGroups: SubGroupSoldModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string;
  SALVAR_RESPOSTA: SubGroupSoldModel;
  totalValue: string;
  params: any;
  camposFiltro: any
  carregandoDados: boolean = false;
  quantidadeVendas: string;
  quantidadeItems: string;
  grafico: any;
  loading: boolean = false;
  options = this.settings.getOptions();
  mensagemNaTela: string = '';
  isVisible: boolean = true
  
  constructor(private repository: SubGroupSoldRepository, private readonly elementRef: ElementRef,
    private settings: CoreService,
    private cdref: ChangeDetectorRef
  ) {
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
      registerFinal: this.date_final,
      _limit: 300,
    }

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

  mostrarMensagem(mensagem: string): void {
    this.mensagemNaTela = mensagem;
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
          this.mostrarMensagem('Não foi possível obter dados para os filtros aplicados.');
          this.loading = false;
          return; 
        } else {
          this.mostrarMensagem('');
        }
        this.SALVAR_RESPOSTA = resp;
        this.subGroups = { ...resp, items: [...resp.items] };

        const value = this.subGroups.items.reduce((total, item) => total + item.value, 0);
        this.totalValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.quantidadeVendas = this.subGroups.items.reduce((total, item) => total + item.qty, 0).toLocaleString('pt-BR');
        this.quantidadeItems = this.subGroups.items.reduce((total, item) => total + item.qtyItems, 0).toLocaleString('pt-BR');

        this.executar(this.subGroups.items, this.grafico);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      }
    });
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
        right: 100 
      },
      animation:false,
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
        data: items.map((item: any) => ({ value: item.subGroupName, textStyle: { fontWeight: 'bold', color: 'black' } })),
        axisLabel: {
        }
      },
      series: [{
        type: 'bar',
        barWidth: '50px',
        encode: {
          x: 'value',
          y: 'subGroupName'
        },
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => {
            const value = params.value.value;
            const quantidade = params.value.qty;
            const quantidadeItens = params.value.qtyItems;
            const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            return `{a|${formattedValue}}\n{b|Vendas: ${quantidade}}\n{c|Itens: ${quantidadeItens}}`;
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
      darkMode: true
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
