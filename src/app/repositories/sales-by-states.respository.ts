import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SalesByStatesModel } from "../models/sales-by-states.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class SalesByStatesRepository extends CrudRepository<SalesByStatesModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/salesByStates");
    }
  }