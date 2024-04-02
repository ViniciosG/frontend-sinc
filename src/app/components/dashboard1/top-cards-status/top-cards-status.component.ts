import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { MaterialModule } from 'src/app/material.module';
import { SalesByStatusModel } from 'src/app/models/sales-by-status.model';
import { SalesByStatusRepository } from 'src/app/repositories/sales-by-status.repository';

@Component({
  selector: 'app-top-cards-status',
  standalone: true,
  imports: [MaterialModule, NgFor, CommonModule],
  templateUrl: './top-cards-status.component.html',
  styleUrls: ['./top-cards-status.component.css']
})
export class TopCardsStatusComponent implements OnInit {
  startDate: Date = new Date();
  endDate: Date = new Date();
  sales: SalesByStatusModel;
  date_inital: string;
  date_final: string;
  params: any

  constructor(private repository: SalesByStatusRepository) {
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
    }
    this.obterDados();

  }

  ngOnInit() {
  }

  obterDados() {
    this.repository.call(this.params).subscribe({
      next: resp => {
        const sortedItems = [...resp.items].sort((a, b) => a.status.localeCompare(b.status)); // Case-insensitive sorting
        sortedItems.pop(); // Remove last element from the array
        this.sales = { ...resp, items: sortedItems }; // Assign sorted data to 'this.sales'
      },
      error: error => {
        console.log(error);
      }
    });
  }
  

}
