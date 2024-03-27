import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { format } from 'date-fns';
import { SalesByCustumersModel } from 'src/app/models/sales-by-custumers.model';
import { SalesByCustomersRepository } from 'src/app/repositories/sales-by-customers.repository';
import { MaterialModule } from '../../../material.module';


export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  position: string;
  productName: string;
  budget: number;
  priority: string;
}

@Component({
  selector: 'app-top-projects',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './top-projects.component.html',
})
export class AppTopProjectsComponent {

  displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];
  dataSource: any;

  params: any;
  startDate: Date = new Date();
  endDate: Date = new Date();
  customers: SalesByCustumersModel;
  date_inital: string;
  date_final: string;
  totalValue: string;
  
  constructor(private repository: SalesByCustomersRepository) {
    const dataAtual = new Date();

    dataAtual.setDate(1);
    dataAtual.setHours(0, 0, 0, 0);

    this.startDate = dataAtual;

    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    this.params = {
      registerInitial: this.date_inital,
      registerFinal:  this.date_final,
      _direction: 'DESC',
      _sort: 'value',
      _limit:'5'
    }


    this.obterDadosERenderizar()
  }

  obterDadosERenderizar() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        const itemsComNovosCampos = resp.items.map((item: any, index: any) => ({
          ...item,
          index: index + 1,
          color: this.calcularCorGradient(index, resp.items.length)
        }));
        // Atualizar o objeto 'resp' com o novo array de items
        resp.items = itemsComNovosCampos;
        this.customers = resp;
        this.dataSource = this.customers.items
      },
      error: error => {
        console.log(error);
      }
    });
  }

    
  calcularCorGradient(index: number, total: number): string {
    const verde = [144, 238, 144]; // Verde pastel
    const vermelho = [255, 99, 71]; // Vermelho pastel
  
    const r = Math.round((vermelho[0] - verde[0]) * (index / total) + verde[0]);
    const g = Math.round((vermelho[1] - verde[1]) * (index / total) + verde[1]);
    const b = Math.round((vermelho[2] - verde[2]) * (index / total) + verde[2]);
  
    return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
  
  componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  formatarParaReais(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarParaValor(valor: number): string {
    return valor.toLocaleString();
  }
}
