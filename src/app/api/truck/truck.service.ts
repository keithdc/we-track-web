import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TruckInterface} from './truck.interface';

@Injectable({
  providedIn: 'root',
})
export class TruckService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<TruckInterface[]> {
    return this.httpClient.get<TruckInterface[]>(`${environment.apiUrl}/api/v1/trucks`);
  }

  findById(id: string): Observable<TruckInterface[]> {
    return this.httpClient.get<TruckInterface[]>(`${environment.apiUrl}/api/v1/truck/{id}`);
  }

  save(tran: TruckInterface): Observable<TruckInterface> {
    if (tran.id) {
      return this.update(tran);
    }
    return this.create(tran);
  }

  create(tran: TruckInterface): Observable<TruckInterface> {
    return this.httpClient.post<TruckInterface>(`${environment.apiUrl}/api/v1/truck`, tran);
  }

  update(tran: TruckInterface): Observable<TruckInterface> {
    return this.httpClient.put<TruckInterface>(`${environment.apiUrl}/api/v1/truck`, tran);
  }
}
