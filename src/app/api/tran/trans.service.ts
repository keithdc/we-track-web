import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TransInterface} from './trans.interface';
import {SearchTranQueryInterface} from './search-tran-query.interface';
import {SearchQueryResponseInterface} from '../abstract/search-query-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TransService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<TransInterface[]> {
    return this.httpClient.get<TransInterface[]>(`${environment.apiUrl}/api/v1/trans`);
  }

  searchByTranId(searchTranQuery: SearchTranQueryInterface): Observable<SearchQueryResponseInterface<TransInterface>> {
    return this.httpClient.post<SearchQueryResponseInterface<TransInterface>>(`${environment.apiUrl}/api/v1/tran`, searchTranQuery, {});
  }

  create(tran: TransInterface, isNewTran: boolean): Observable<TransInterface> {
    return this.httpClient.post<TransInterface>(`${environment.apiUrl}/api/v1/tran/${isNewTran}`, tran);
  }

  update(tran: TransInterface): Observable<TransInterface> {
    return this.httpClient.put<TransInterface>(`${environment.apiUrl}/api/v1/tran`, tran);
  }
}
