import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {LogInterface} from './log.interface';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<LogInterface[]> {
    return this.httpClient.get<LogInterface[]>(`${environment.apiUrl}/api/v1/logs`);
  }

  findById(id: string): Observable<LogInterface[]> {
    return this.httpClient.get<LogInterface[]>(`${environment.apiUrl}/api/v1/log/{id}`);
  }

  save(tran: LogInterface): Observable<LogInterface> {
    if (tran.id) {
      return this.update(tran);
    }
    return this.create(tran);
  }

  create(tran: LogInterface): Observable<LogInterface> {
    return this.httpClient.post<LogInterface>(`${environment.apiUrl}/api/v1/log`, tran);
  }

  update(tran: LogInterface): Observable<LogInterface> {
    return this.httpClient.put<LogInterface>(`${environment.apiUrl}/api/v1/log`, tran);
  }
}
