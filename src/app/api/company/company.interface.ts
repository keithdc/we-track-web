import {AuditInterfaceInterface} from '../abstract/audit.interface';
import {StatusEnum} from './status.enum';

export interface CompanyInterface extends AuditInterfaceInterface {
  name: string;
  address: string;
  status: StatusEnum;
}
