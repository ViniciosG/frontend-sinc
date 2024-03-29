import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MaterialModule } from 'src/app/material.module';
import { NewCustomersPerSellersModel } from 'src/app/models/new-customers-per-sellers.model';
import { FiltersComponent } from '../components/filters/filters.component';
import { NewCustomersPerSellersRepository } from './../../../repositories/new-customers-per-sellers.repository';

@Component({
  selector: 'app-new-customers-per-sellers',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule,NgForOf, FiltersComponent],
  templateUrl: './new-customers-per-sellers.component.html',
  styleUrls: ['./new-customers-per-sellers.component.css']
})
export class NewCustomersPerSellersComponent implements OnInit {

  showValue: boolean = true;
  startDate: Date = new Date();
  endDate: Date = new Date();
  customers: NewCustomersPerSellersModel = new NewCustomersPerSellersModel()
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string
  params: any;
  camposFiltro:any
  visible: boolean = true;
  isLoading: boolean = false;
  errorTrue: boolean = false;
  quantidadeClientes: string;
  totalValue: string;

  constructor(private repository: NewCustomersPerSellersRepository) {
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
      _direction: 'DESC',
      _sort: 'qty',
      _limit: 30
    }

    
   this.camposFiltro = [
    { label: 'Vendedor', placeholder: 'Vendedor', type: 'text', visivel: true, id: "sellerName" },
    { label: 'Tipo', placeholder: 'Tipo', type: 'text', visivel: true, id: "sellerType" },
    { label: 'Ranking', placeholder: 'Ranking', type: 'select', visivel: true, options: ['5', '10', '20','30'], id: "_limit" },
    { label: 'Data Início', placeholder: 'Data Início', type: 'date', visivel: true, value: this.startDate, id: "registerInitial" },
    { label: 'Data Fim', placeholder: 'Data Fim', type: 'date', visivel: true, value: this.endDate, id: "registerFinal" },
    { label: 'Filtrar', placeholder: 'Filtrar', type: 'select', visivel: true, value:'thisMonth', options: [
      { label: 'Hoje', value: 'today' },
      { label: 'Semana', value: 'lastWeek' },
      { label: 'Mês', value: 'thisMonth' }
    ], id: 'dateSelector' },
    
  ];
   }


  ngOnInit() {
    this.obterDadosERenderizarGrafico();
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
    this.obterDadosERenderizarGrafico()
    this.visible = false
  }

  obterDadosERenderizarGrafico() {
    this.isLoading = true; // Definir como verdadeira antes de iniciar a solicitação
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.isLoading = false;
        if (resp === null) {
          this.errorTrue = true;
        } else {
          const itemsComNovosCampos = resp.items.map((item: any, index: any) => ({
            ...item,
            index: index + 1,
            color: this.calcularCorGradient(index, resp.items.length)
          }));
          // Atualizar o objeto 'resp' com o novo array de items
          resp.items = itemsComNovosCampos;
          this.customers = resp;
          this.quantidadeClientes = this.customers.items.reduce((total, item) => total + item.qty, 0).toLocaleString('pt-BR');

          this.errorTrue = false;
        }
      },
      error: error => {
        this.errorTrue = true;
        this.isLoading = false; // Definir como falsa em caso de erro
        console.log(error);
      }
    });
  }
  
  calcularCorGradient(index: number, total: number): string {
    // Calcular uma cor gradient entre verde e vermelho
    const verde = [144, 238, 144]; // Verde pastel
    const vermelho = [255, 99, 71]; // Vermelho pastel
  
    // Calcular os valores RGB para cada índice
    const r = Math.round((vermelho[0] - verde[0]) * (index / total) + verde[0]);
    const g = Math.round((vermelho[1] - verde[1]) * (index / total) + verde[1]);
    const b = Math.round((vermelho[2] - verde[2]) * (index / total) + verde[2]);
  
    // Formatar a cor RGB como uma string hexadecimal
    return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
  
  componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  parametrosPadrao() {
    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
      _direction: 'DESC',
      _sort: 'qty',
      _limit: 30
    }
    this.obterDadosERenderizarGrafico();
  }

}
