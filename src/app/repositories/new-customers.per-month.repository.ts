import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NewCustomersPerMonthModel } from "../models/new-customers-per-month.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class NewCustomersPerMonthsRepository extends CrudRepository<NewCustomersPerMonthModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/newCustomersPerMonth");
    }
  }