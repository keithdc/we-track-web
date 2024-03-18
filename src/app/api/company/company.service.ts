import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CompanyInterface} from './company.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<CompanyInterface[]> {
    return this.httpClient.get<CompanyInterface[]>(`${environment.apiUrl}/api/v1/companies`);
  }

  findById(id: string): Observable<CompanyInterface[]> {
    return this.httpClient.get<CompanyInterface[]>(`${environment.apiUrl}/api/v1/company/{id}`);
  }

  save(tran: CompanyInterface): Observable<CompanyInterface> {
    if (tran.id) {
      return this.update(tran);
    }
    return this.create(tran);
  }

  create(tran: CompanyInterface): Observable<CompanyInterface> {
    return this.httpClient.post<CompanyInterface>(`${environment.apiUrl}/api/v1/company`, tran);
  }

  update(tran: CompanyInterface): Observable<CompanyInterface> {
    return this.httpClient.put<CompanyInterface>(`${environment.apiUrl}/api/v1/company`, tran);
  }
}
