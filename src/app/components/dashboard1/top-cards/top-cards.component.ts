import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { format } from 'date-fns';
import { SellersByCustomersModel } from 'src/app/models/sellers-br-customers.model';
import { AuthService } from 'src/app/pages/authentication/service/auth.service';
import { SellersByCustomersRepository } from 'src/app/repositories/sellers-by-customers.repository';
import { MaterialModule } from '../../../material.module';

interface topcards {
  id: number;
  img: string;
  color: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule, NgFor, MatChipsModule],
  templateUrl: './top-cards.component.html',
  styleUrls: ['./top-cards.component.css']
})
export class AppTopCardsComponent {
  startDate: Date = new Date();
  endDate: Date = new Date();
  customers: SellersByCustomersModel;
  customersAtacado: SellersByCustomersModel;
  date_inital: string;
  date_final: string;
  params: any
  paramsAtacado: any
  clientesAtivos: any
  clientesAtivosPorcentagem: any
  clientesInativosPorcentagem: any

  clientesInativos: any
  clientesInativosComOrcamento: any
  clientesAtivosAtacado: any
  clientesInativosAtacado: any
  clientesInativosComOrcamentoAtacado: any
  clientesAtivosPorcentagemAtacado: any
  clientesInativosPorcentagemAtacado: any

  constructor(private repository: SellersByCustomersRepository,
    public auth: AuthService) {
    const dataAtual = new Date();

    dataAtual.setDate(1);
    dataAtual.setHours(0, 0, 0, 0);

    this.startDate = dataAtual;
    this.endDate = new Date();

    this.date_inital = format(this.startDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    this.date_final = format(this.endDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    this.params = {
      registerInitial: this.date_inital,
      registerFinal: this.date_final,
    }

    this.paramsAtacado = {
      registerInitial: this.date_inital,
      registerFinal: this.date_final,
      sellerType: 'ATACADO'
    }

    this.obterDados();
    this.obterDadosAtacado();
  }

  ngOnInit(): void {
  }

  obterDados() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.customers = resp;

        const valueAtivos = this.customers.items.reduce((total, item) => total + item.active, 0);
        const valueInativos = this.customers.items.reduce((total, item) => total + item.inactive, 0);
        const valueInativosCOrcamento = this.customers.items.reduce((total, item) => total + item.inactiveWithBudget, 0);

        const totalClientes = valueAtivos + valueInativos + valueInativosCOrcamento;
        const porcentagemAtivos = (valueAtivos / totalClientes) * 100;
        const inativos = valueInativosCOrcamento + valueInativos
        const porcentagemInativos = (inativos / totalClientes) * 100;

        this.clientesAtivosPorcentagem = porcentagemAtivos.toFixed(2);
        this.clientesInativosPorcentagem = porcentagemInativos.toFixed(2);
        this.clientesAtivos = valueAtivos.toLocaleString();
        this.clientesInativos = valueInativos.toLocaleString();
        this.clientesInativosComOrcamento = valueInativosCOrcamento.toLocaleString();

      },
      error: error => {
        console.log(error);
      }
    });
  }

  obterDadosAtacado() {
    this.repository.call(this.paramsAtacado).subscribe({
      next: resp => {
        this.customers = resp;

        const valueAtivosAtacado = this.customers.items.reduce((total, item) => total + item.active, 0);
        const valueInativosAtacado = this.customers.items.reduce((total, item) => total + item.inactive, 0);
        const valueInativosCOrcamentoAtacado = this.customers.items.reduce((total, item) => total + item.inactiveWithBudget, 0);

        const totalClientes = valueAtivosAtacado + valueInativosAtacado + valueInativosCOrcamentoAtacado;
        const porcentagemAtivos = (valueAtivosAtacado / totalClientes) * 100;
        const inativos = valueInativosCOrcamentoAtacado + valueInativosAtacado
        const porcentagemInativos = (inativos / totalClientes) * 100;

        this.clientesAtivosAtacado = valueAtivosAtacado.toLocaleString();
        this.clientesAtivosPorcentagemAtacado = porcentagemAtivos.toFixed(2);
        this.clientesInativosPorcentagemAtacado = porcentagemInativos.toFixed(2);
        this.clientesInativosAtacado = valueInativosAtacado.toLocaleString();
        this.clientesInativosComOrcamentoAtacado = valueInativosCOrcamentoAtacado.toLocaleString();

      },
      error: error => {
        console.log(error);
      }
    });
  }
}
