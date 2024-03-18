import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TruckTypeInterface} from './truck-type.interface';

@Injectable({
  providedIn: 'root',
})
export class TruckTypeService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<TruckTypeInterface[]> {
    return this.httpClient.get<TruckTypeInterface[]>(`${environment.apiUrl}/api/v1/truck-types`);
  }

  findById(id: string): Observable<TruckTypeInterface[]> {
    return this.httpClient.get<TruckTypeInterface[]>(`${environment.apiUrl}/api/v1/truck-type/{id}`);
  }

  save(tran: TruckTypeInterface): Observable<TruckTypeInterface> {
    if (tran.id) {
      return this.update(tran);
    }
    return this.create(tran);
  }

  create(tran: TruckTypeInterface): Observable<TruckTypeInterface> {
    return this.httpClient.post<TruckTypeInterface>(`${environment.apiUrl}/api/v1/truck-type`, tran);
  }

  update(tran: TruckTypeInterface): Observable<TruckTypeInterface> {
    return this.httpClient.put<TruckTypeInterface>(`${environment.apiUrl}/api/v1/truck-type`, tran);
  }
}
