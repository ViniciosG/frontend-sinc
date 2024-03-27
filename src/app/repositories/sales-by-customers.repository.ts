import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SalesByCustumersModel } from "../models/sales-by-custumers.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class SalesByCustomersRepository extends CrudRepository<SalesByCustumersModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/salesByCustomers");
    }
  }