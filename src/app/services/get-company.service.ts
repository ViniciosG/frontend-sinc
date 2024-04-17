import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetCompanyService {
  private company: any;
  private storageKey = 'company';
  constructor() {
  }
  setCompany(company: any) {
    this.company = company;
    localStorage.setItem(this.storageKey, JSON.stringify(company));
  }

  getCompany() {
    const storedCompany = localStorage.getItem(this.storageKey);
    if (storedCompany) {
      this.company = JSON.parse(storedCompany);
    }
    return this.company;
  }
}
