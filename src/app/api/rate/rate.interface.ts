import {AuditInterfaceInterface} from '../abstract/audit.interface';
import {CompanyInterface} from '../company/company.interface';

export interface RateInterface extends AuditInterfaceInterface {
  company: CompanyInterface;
  fromDestination: string;
  toDestination: string;
  rateCode: string;
  amount: number
}
