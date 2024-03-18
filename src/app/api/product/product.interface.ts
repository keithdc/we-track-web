import {AuditInterfaceInterface} from '../abstract/audit.interface';
import {InventoryInterface} from '../inventory/inventory.interface';

export interface ProductInterface extends AuditInterfaceInterface{
  inventoryId: InventoryInterface;
  name: string;
  tranId: string;
  quantity: number;
  total: number;
  isVoid: boolean;
}
