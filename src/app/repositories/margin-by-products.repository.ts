import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MarginByProductsModel } from "../models/margin-by-products.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class MarginByProductsRepository extends CrudRepository<MarginByProductsModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/marginByProducts");
    }
  }