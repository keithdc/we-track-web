import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {SaleInterface} from './sale.interface';
import {SearchSaleQueryInterface} from './search-sale-query.interface';
import {SearchQueryResponseInterface} from '../abstract/search-query-response.interface';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<SaleInterface[]> {
    return this.httpClient.get<SaleInterface[]>(`${environment.apiUrl}/api/v1/sales`);
  }

  findById(id: string): Observable<SaleInterface[]> {
    return this.httpClient.get<SaleInterface[]>(`${environment.apiUrl}/api/v1/sale/{id}`);
  }

  getAllByTranId(searchSaleQuery: SearchSaleQueryInterface): Observable<SearchQueryResponseInterface<SaleInterface>> {
    return this.httpClient.post<SearchQueryResponseInterface<SaleInterface>>(`${environment.apiUrl}/api/v1/sale`, searchSaleQuery, {});
  }

  create(tran: SaleInterface): Observable<SaleInterface> {
    return this.httpClient.post<SaleInterface>(`${environment.apiUrl}/api/v1/sale`, tran);
  }

  update(tran: SaleInterface): Observable<SaleInterface> {
    return this.httpClient.put<SaleInterface>(`${environment.apiUrl}/api/v1/sale`, tran);
  }
}
