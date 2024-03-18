import {AuditInterfaceInterface} from '../abstract/audit.interface';
import {TruckInterface} from '../truck/truck.interface';
import {RateInterface} from '../rate/rate.interface';
import {StatusLogEnum} from './status-log.enum';

export interface LogInterface extends AuditInterfaceInterface {
  voucherCode: string;
  truck: TruckInterface;
  rate: RateInterface;
  status: string;
}
