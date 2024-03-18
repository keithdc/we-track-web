import {SearchQuery} from '../abstract/search-query.interface';

export interface SearchTranQueryInterface extends SearchQuery {
  tranId: string;
}
