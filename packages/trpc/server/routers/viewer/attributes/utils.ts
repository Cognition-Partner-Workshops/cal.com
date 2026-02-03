/**
 * Ensures that contains has no non-existent sub-options
 */
export function getOptionsWithValidContains<
  T extends { id?: string; value: string; contains?: string[]; isGroup?: boolean },
>(options: T[]): T[] {
  const deduplicatedOptions = Array.from(
    options
      .reduce((map, option) => {
        const existing = map.get(option.value);
        if (!existing) {
          map.set(option.value, option);
        } else if (!existing.id && option.id) {
          map.set(option.value, option);
        }
        return map;
      }, new Map<string, T>())
      .values()
  );

  return deduplicatedOptions.map(({ contains, ...option }) => {
    if (!contains)
      return {
        ...option,
        contains: [] as string[],
      } as T;
    const possibleSubOptions = options
      .filter((option) => !option.isGroup)
      .filter((option): option is typeof option & { id: string } => option.id !== undefined);

    const possibleSubOptionsIds = possibleSubOptions.map((option) => option.id);

    return {
      ...option,
      contains: contains.filter((subOptionId) => possibleSubOptionsIds.includes(subOptionId)),
    } as T;
  });
}
