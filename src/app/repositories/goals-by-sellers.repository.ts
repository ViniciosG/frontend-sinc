import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GoalsBySellersModel } from "../models/goals-by-sellers.model";
import { CrudRepository } from "./crud.repository";

@Injectable({
    providedIn: 'root'
  })
  export class GoalsBySellersRepository extends CrudRepository<GoalsBySellersModel> {
    constructor(http: HttpClient) {
      super(http, "dashboards/sales/goalsBySellers");
    }
  }