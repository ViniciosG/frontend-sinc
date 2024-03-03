import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export abstract class CrudRepository<T> {
  protected apiUrl = environment.apiUrlApp;
  // protected endpoint_marketplaces = environment.marketplaces;
  // protected endpoint_associate = environment.associate;
  // protected endpoint_specification_associate = environment.specification;
  protected endpoint_activate = "activate";
  protected endpoint_deactivate = "deactivate";
  protected endpoint_marketplace = "marketplaces";
  protected brands = "marketplaces";
  protected product = "products";
  protected logs = "logs";
  protected asc = "asc"

  constructor(protected http: HttpClient, protected endpoint: String) { }

  public getSingle(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  public getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${this.endpoint}`);
  }

  public delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  public post(item: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${this.endpoint}`, item,);
  }

  public update(id: any, item: T) {
    return this.http.put<T>(`${this.apiUrl}/${this.endpoint}/${id}`, item);
  }

  public updateGoals(id: any, item: T) {
    return this.http.put<T>(`${this.apiUrl}/${this.endpoint}/${id}/goals`, item);
  }

  getGoalsBySellers(registerInitial: string, registerFinal: string): Observable<any> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}?registerInitial=${registerInitial}&registerFinal=${registerFinal}`);
  }

  getNewCustomersMonth(registerInitial: string, registerFinal: string): Observable<any> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}?registerInitial=${registerInitial}&registerFinal=${registerFinal}`);
  }

  getProductsSold(registerInitial: string, registerFinal: string,limit:number, direction:string, sort:string, ): Observable<any> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}?registerInitial=${registerInitial}&registerFinal=${registerFinal}&_direction=${direction}&_sort=${sort}&_limit=${limit}`);
  }

  getNewCustomersSellers(registerInitial: string, registerFinal: string,limit:number, direction:string, sort:string, ): Observable<any> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}?registerInitial=${registerInitial}&registerFinal=${registerFinal}&_direction=${direction}&_sort=${sort}&_limit=${limit}`);
  }

  getProductsSoldMarketplace(registerInitial: string, registerFinal: string, _limit: number, offset: number, _sort: string, marketplace_id: number): Observable<any> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}?registerInitial=${registerInitial}&registerFinal=${registerFinal}&_limit=${_limit}&_offset=${offset}&_sort=${_sort}&marketplace_id=${marketplace_id}`);
  }

  getMarket(registerInitial: string, registerFinal: string, _sort: string): Observable<any> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}?register_initial=${registerInitial}&register_final=${registerFinal}&_sort=${_sort}`);
  }

  getOrderByMonths(registerInitial: string, registerFinal: string): Observable<any> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}?register_initial=${registerInitial}&register_final=${registerFinal}`);
  }

  // public postCategoriesAssociate(internal_id: number, categorie_id: number, item: T): Observable<T> {
  //   return this.http.post<T>(`${this.apiUrl}/${this.endpoint}/${internal_id}/${this.endpoint_marketplace}/${categorie_id}/${this.endpoint_associate}`, item);
  // }

  // public post_categories_specifications(id: string, id_merket_spe: string, item: T): Observable<T> {
  //   return this.http.post<T>(`${this.apiUrl}/${this.endpoint}/${id}/${this.endpoint_marketplace}/${id_merket_spe}/${this.endpoint_specification_associate}`, item);
  // }


  public products_update_activate(id: any, item: T) {
    return this.http.put<T>(`${this.apiUrl}/${this.endpoint}/${id}/${this.endpoint_activate}`, item);
  }

  public products_update_deactivate(id: any, item: T) {
    return this.http.put<T>(`${this.apiUrl}/${this.endpoint}/${id}/${this.endpoint_deactivate}`, item);
  }



  getSearchFilters(filters: string, sort: string, offset: number, limit: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}?_sort=${sort}&_offset=${offset * limit}&_limit=${limit}${filters}`);
  }

  getSearch(item: T): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}`);
  }

  getLogsPrices(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}/${id}/prices/${this.logs}`);
  }

  getLogsStocks(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${this.endpoint}/${id}/stocks/${this.logs}`);
  }

  public sendIntegrations(id: any, item: T, marletplace_id: string) {
    return this.http.put<T>(`${this.apiUrl}/${this.endpoint}/${id}/sendPlatform?marketplace_id=${marletplace_id}`, item);
  }

  // public getAllMarketplaces(): Observable<T[]> {
  //   return this.http.get<T[]>(`${this.apiUrl}/${this.endpoint_marketplaces}`);
  // }

  // public getAllSubCategories(internal_id: string): Observable<T[]> {
  //   return this.http.get<T[]>(`${this.apiUrl}/${this.endpoint_marketplaces}?father_id=${internal_id}`);
  // }

  etLabelsForMonths() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const labels = [];

    for (let month = 0; month <= currentMonth; month++) {
      const date = new Date(currentYear, month, 1);
      const monthName = date.toLocaleString('default', { month: 'long' });
      labels.push(`${monthName}`);
    }

    return labels;
  }
}
