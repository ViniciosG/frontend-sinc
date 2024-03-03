import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SalesByDayOfWeekModel } from "../models/sales-by-day-of-week.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class SalesByDayOfWeekRepository extends CrudRepository<SalesByDayOfWeekModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/salesByDayOfWeek");
    }
  }