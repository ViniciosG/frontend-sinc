import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SalesByStatusModel } from "../models/sales-by-status.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class SalesByStatusRepository extends CrudRepository<SalesByStatusModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/salesByStatus");
    }
  }