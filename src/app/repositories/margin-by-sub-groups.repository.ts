import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MarginBySubGroupsModel } from "../models/margin-by-sub-groups.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class MarginBySubGroupsRepository extends CrudRepository<MarginBySubGroupsModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/marginBySubGroups");
    }
  }