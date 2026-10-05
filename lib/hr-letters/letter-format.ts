export type HRLetterTextStyle =
  | 'employeeName'
  | 'employmentType'
  | 'issuedDate'
  | 'normal';

export interface HRLetterTextSegment {
  text: string;
  style: HRLetterTextStyle;
}

export function removeEmployeeIdFromLetter(text: string): string {
  return text
    .replace(
      /\s*\(?\s*employee\s+id\s*:\s*(?:\{\{\s*employee_id\s*\}\}|[^\n),.]+)\s*\)?/gi,
      ''
    )
    .replace(/\{\{\s*employee_id\s*\}\}/gi, '')
    .replace(/[ \t]{2,}/g, ' ');
}

export function formatHRLetterText(
  text: string,
  values: {
    employeeName: string;
    employmentType: string;
    issuedDate: string;
  }
): HRLetterTextSegment[] {
  const source = removeEmployeeIdFromLetter(text);
  const markers: {
    value: string;
    style: Exclude<HRLetterTextStyle, 'normal'>;
  }[] = [
    { value: values.employeeName, style: 'employeeName' },
    { value: values.employmentType, style: 'employmentType' },
    { value: values.issuedDate, style: 'issuedDate' },
  ];
  const seen = new Set<string>();
  const uniqueMarkers = markers
    .filter(({ value }) => value.trim())
    .filter(({ value }) => {
      const key = value.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((left, right) => right.value.length - left.value.length);

  if (!uniqueMarkers.length) return [{ text: source, style: 'normal' }];

  const expression = new RegExp(
    uniqueMarkers
      .map(({ value }) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|'),
    'gi'
  );
  const segments: HRLetterTextSegment[] = [];
  let lastIndex = 0;

  for (const match of source.matchAll(expression)) {
    const value = match[0];
    const index = match.index;
    if (index === undefined) continue;
    if (index > lastIndex) {
      segments.push({ text: source.slice(lastIndex, index), style: 'normal' });
    }
    const marker = uniqueMarkers.find(
      (candidate) =>
        candidate.value.toLocaleLowerCase() === value.toLocaleLowerCase()
    );
    segments.push({ text: value, style: marker?.style || 'normal' });
    lastIndex = index + value.length;
  }

  if (lastIndex < source.length) {
    segments.push({ text: source.slice(lastIndex), style: 'normal' });
  }
  return segments;
}
