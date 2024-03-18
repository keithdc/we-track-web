import {enumList, EnumNameDescription} from '../../shared/enum/enum';

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export class StatusEnumUtil {
  public static description(type: StatusEnum): string | undefined {
    switch (type) {
      case StatusEnum.ACTIVE:
        return 'Active';
      case StatusEnum.INACTIVE:
        return 'Inactive';
      case StatusEnum.DELETED:
        return 'DELETED';
    }
    return undefined;
  }

  public static list(): Array<EnumNameDescription> {
    return enumList<StatusEnum>(Object.values(StatusEnum),
      this.description, null);
  }
}
