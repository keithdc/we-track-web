import {AuditInterfaceInterface} from '../abstract/audit.interface';
import {TruckTypeInterface} from '../truck-type/truck-type.interface';

export interface TruckInterface extends AuditInterfaceInterface {
  plateNumber: string;
  type: TruckTypeInterface;
  truckType?: string;
}
