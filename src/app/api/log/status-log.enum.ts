import {enumList, EnumNameDescription} from '../../shared/enum/enum';

export enum StatusLogEnum {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPlETED = 'COMPlETED',
  CANCELED = 'CANCELED',
  FORCE_MAJEURE = 'FORCE_MAJEURE',
}

export class StatusLogEnumUtil {
  public static description(type: StatusLogEnum): string {
    switch (type) {
      case StatusLogEnum.IN_PROGRESS:
        return 'In Progress';
      case StatusLogEnum.COMPlETED:
        return 'Completed';
      case StatusLogEnum.CANCELED:
        return 'Canceled';
      case StatusLogEnum.FORCE_MAJEURE:
        return 'Force Majeure';
    }
    return '';
  }

  public static list(): Array<EnumNameDescription> {
    return enumList<StatusLogEnum>(Object.values(StatusLogEnum),
      this.description, null);
  }
}
