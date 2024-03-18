import {AuditInterfaceInterface} from '../abstract/audit.interface';

export interface TransInterface extends AuditInterfaceInterface{
  productId: string;
  name: string;
  tranId: string;
  quantity: number;
  total: number;
  isVoid: boolean;
}
