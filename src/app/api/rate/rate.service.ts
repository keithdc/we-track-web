import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {RateInterface} from './rate.interface';

@Injectable({
  providedIn: 'root',
})
export class RateService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<RateInterface[]> {
    return this.httpClient.get<RateInterface[]>(`${environment.apiUrl}/api/v1/rates`);
  }

  findById(id: string): Observable<RateInterface[]> {
    return this.httpClient.get<RateInterface[]>(`${environment.apiUrl}/api/v1/rate/{id}`);
  }

  save(tran: RateInterface): Observable<RateInterface> {
    if (tran.id) {
      return this.update(tran);
    }
    return this.create(tran);
  }

  create(tran: RateInterface): Observable<RateInterface> {
    return this.httpClient.post<RateInterface>(`${environment.apiUrl}/api/v1/rate`, tran);
  }

  update(tran: RateInterface): Observable<RateInterface> {
    return this.httpClient.put<RateInterface>(`${environment.apiUrl}/api/v1/rate`, tran);
  }
}
