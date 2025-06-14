// mouse.js
import { monthNames } from '@/models/Month';

export function monthRange(task: Task) {
  const startMonth = monthNames[task!.monthStart];
  const endMonth = monthNames[task!.monthEnd];

  return startMonth == endMonth
    ? `(${startMonth})` 
    : `(${startMonth} - ${endMonth})`;
}

export function sectionsForMonth(sections: Section[], month: number) {
  return sections.filter((section) => 
    section.rows.flatMap(s => s.tasks).some((s) => 
      s.monthStart <= month && 
      s.monthEnd >= month));
}

export function taskForMonth(section: Section, month: number) {
  return section.rows.flatMap(s => s.tasks).filter((s) =>
      s.monthStart <= month && 
      s.monthEnd >= month);
}