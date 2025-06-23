// mouse.js
import { monthNames } from '@/models/Month';

export function monthRange(task: Task) {
  const startMonth = monthNames[task!.monthStart];
  const endMonth = monthNames[task!.monthEnd];

  return startMonth == endMonth
    ? `(${startMonth})` 
    : `(${startMonth} - ${endMonth})`;
}

export function sectionsForMonth(sections: Section[], month: number, tagFilter: string[] = [], sortBy: string = "") {
  var sections = sections.filter((section) => 
    section.rows.flatMap(s => s.tasks).some((s) => 
      s.monthStart <= month &&
      s.monthEnd >= month)
    && (tagFilter.length == 0 || section.tags.some(t => tagFilter.includes(t.name))));

    if (sortBy == "Alphabetically") {
      sections.sort((a, b) => ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0)))
    }

    return sections;
}

export function taskForMonth(section: Section, month: number) {
  return section.rows.flatMap(s => s.tasks).filter((s) =>
      s.monthStart <= month &&
      s.monthEnd >= month);
}