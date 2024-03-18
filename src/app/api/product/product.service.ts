import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProductInterface} from './product.interface';
import {SearchProductQueryInterface} from './search-product-query.interface';
import {SearchQueryResponseInterface} from '../abstract/search-query-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ProductInterface[]> {
    return this.httpClient.get<ProductInterface[]>(`${environment.apiUrl}/api/v1/products`);
  }

  findById(id: string): Observable<ProductInterface[]> {
    return this.httpClient.get<ProductInterface[]>(`${environment.apiUrl}/api/v1/product/{id}`);
  }

  getAllByTranId(searchProductQuery: SearchProductQueryInterface): Observable<SearchQueryResponseInterface<ProductInterface>> {
    return this.httpClient.post<SearchQueryResponseInterface<ProductInterface>>(`${environment.apiUrl}/api/v1/product`, searchProductQuery, {});
  }


  save(tran: ProductInterface): Observable<ProductInterface> {
    if (tran.id) {
      return this.update(tran);
    }
    return this.create(tran);
  }

  create(tran: ProductInterface): Observable<ProductInterface> {
    return this.httpClient.post<ProductInterface>(`${environment.apiUrl}/api/v1/product`, tran);
  }

  update(tran: ProductInterface): Observable<ProductInterface> {
    return this.httpClient.put<ProductInterface>(`${environment.apiUrl}/api/v1/product`, tran);
  }
}
