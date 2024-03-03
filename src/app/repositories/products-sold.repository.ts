import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProductsSoldModel } from "../models/products-sold.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class ProductsSoldsRepository extends CrudRepository<ProductsSoldModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/productsSold");
    }
  }