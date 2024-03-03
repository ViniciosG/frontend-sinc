import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NewCustomersPerSellersModel } from "../models/new-customers-per-sellers.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class NewCustomersPerSellersRepository extends CrudRepository<NewCustomersPerSellersModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/newCustomersPerSellers");
    }
  }