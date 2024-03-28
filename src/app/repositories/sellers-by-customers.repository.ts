import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SellersByCustomersModel } from "../models/sellers-br-customers.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class SellersByCustomersRepository extends CrudRepository<SellersByCustomersModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/sellersByCustomers");
    }
  }