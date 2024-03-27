import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { SubGroupSoldModel } from 'src/app/models/sub-group-sold.model';
import { SubGroupSoldRepository } from 'src/app/repositories/sub-group-sold.repository';
import { MaterialModule } from '../../../material.module';
import { yearlyChart } from '../yearly-breakup/yearly-breakup.component';

@Component({
  selector: 'app-selling-product',
  standalone: true,
  imports: [MaterialModule,CommonModule, NgApexchartsModule, TablerIconsModule],

  templateUrl: './selling-product.component.html',
})
export class AppSellingProductComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  
  public yearlyChart!: Partial<yearlyChart> | any;

  startDate: Date = new Date();
  endDate: Date = new Date();
  subGroups: SubGroupSoldModel;
  date_inital: string;
  date_final: string;
  inititalContext: string;
  endContext: string;
  SALVAR_RESPOSTA: any;
  option: any;
  totalValue: string;
  selectValue: number = 5;
  params: any;
  
  constructor(private repository: SubGroupSoldRepository) {
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
      _limit: 3,
      _direction: 'DESC',
      _sort: 'qtyItems',
    }

    this.obterDadosERenderizarGrafico()
  }

  obterDadosERenderizarGrafico() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        this.subGroups = resp;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  formatarParaReais(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarParaValor(valor: number): string {
    return valor.toLocaleString();
  }
}
