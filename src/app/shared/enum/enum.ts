export class EnumNameDescription {

  name: string;
  description: string;

  constructor(theName: string, theDescription: string) {
    this.name = theName;
    this.description = theDescription;
  }
}

export function enumList<T>(enumTypes: T[], descriptionFn: Function, omitTypes: Array<T> | null): EnumNameDescription[] {
  const list = new Array<EnumNameDescription>();
  for (const type of enumTypes) {
    if (typeof type !== 'function') {
      if (!omitTypes || omitTypes.indexOf(type) === -1) {
        const enumNameDescription = new EnumNameDescription(type as unknown as string, descriptionFn(type));
        list.push(enumNameDescription);
      }
    }
  }
  return list;
}
