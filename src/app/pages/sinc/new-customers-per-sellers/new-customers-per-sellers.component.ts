import { CommonModule, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MaterialModule } from 'src/app/material.module';
import { NewCustomersPerSellersModel } from 'src/app/models/new-customers-per-sellers.model';
import { NewCustomersPerSellersRepository } from './../../../repositories/new-customers-per-sellers.repository';

@Component({
  selector: 'app-new-customers-per-sellers',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule,NgForOf],
  templateUrl: './new-customers-per-sellers.component.html',
  styleUrls: ['./new-customers-per-sellers.component.css']
})
export class NewCustomersPerSellersComponent implements OnInit {

  showValue: boolean = true;
  startDate: Date = new Date();
  endDate: Date = new Date();
  customers: NewCustomersPerSellersModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string
  selectValue: number = 5;

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
   }

  ngOnInit() {
    this.obterDadosERenderizarGrafico();
  }

  obterDadosERenderizarGrafico() {
    this.repository.getNewCustomersSellers(this.date_inital, this.date_final, this.selectValue, "DESC", "qty").subscribe({
      next: resp => {
        // Criar um novo array com os campos 'index' e 'color' adicionados
        const itemsComNovosCampos = resp.items.map((item:any, index:any) => ({
          ...item,
          index: index + 1,
          color: this.calcularCorGradient(index, resp.items.length)
        }));
        // Atualizar o objeto 'resp' com o novo array de items
        resp.items = itemsComNovosCampos;
        this.customers = resp;
        console.log(this.customers)
      },
      error: error => {
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

}
