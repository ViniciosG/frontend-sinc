import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SubGroupSoldModel } from "../models/sub-group-sold.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class SubGroupSoldRepository extends CrudRepository<SubGroupSoldModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/subGroupsSold");
    }
  }