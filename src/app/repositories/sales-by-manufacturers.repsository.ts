import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SalesByManufacturersModel } from "../models/sales-by-manufacturers.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class SalesByManufacturersRepository extends CrudRepository<SalesByManufacturersModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/salesByManufacturers");
    }
  }