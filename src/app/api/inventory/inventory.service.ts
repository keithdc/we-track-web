import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {InventoryInterface} from './inventory.interface';
import {SearchInventoryQueryInterface} from './search-inventory-query.interface';
import {SearchQueryResponseInterface} from '../abstract/search-query-response.interface';
import {TransInterface} from '../tran/trans.interface';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<InventoryInterface[]> {
    return this.httpClient.get<InventoryInterface[]>(`${environment.apiUrl}/api/v1/inventories`);
  }

  findById(id: string): Observable<InventoryInterface[]> {
    return this.httpClient.get<InventoryInterface[]>(`${environment.apiUrl}/api/v1/inventory/{id}`);
  }

  search(searchTranQuery: SearchInventoryQueryInterface): Observable<SearchQueryResponseInterface<TransInterface>> {
    return this.httpClient.post<SearchQueryResponseInterface<InventoryInterface>>(`${environment.apiUrl}/api/v1/inventory/search`, searchTranQuery, {});
  }

  getAllByTranId(searchInventoryQuery: SearchInventoryQueryInterface): Observable<SearchQueryResponseInterface<InventoryInterface>> {
    return this.httpClient.post<SearchQueryResponseInterface<InventoryInterface>>(`${environment.apiUrl}/api/v1/inventory`, searchInventoryQuery, {});
  }

  save(tran: InventoryInterface): Observable<InventoryInterface> {
    if (tran.id) {
      return this.update(tran);
    }
    return this.create(tran);
  }

  private create(tran: InventoryInterface): Observable<InventoryInterface> {
    return this.httpClient.post<InventoryInterface>(`${environment.apiUrl}/api/v1/inventory`, tran, {});
  }

  private update(tran: InventoryInterface): Observable<InventoryInterface> {
    return this.httpClient.put<InventoryInterface>(`${environment.apiUrl}/api/v1/inventory`, tran);
  }
}
