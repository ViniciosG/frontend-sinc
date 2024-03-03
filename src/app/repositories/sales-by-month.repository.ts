import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SalesByMonthModel } from "../models/sales-by-month.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class SalesByMonthRepository extends CrudRepository<SalesByMonthModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/salesByMonth");
    }
  }