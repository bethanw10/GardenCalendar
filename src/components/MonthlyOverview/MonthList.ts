// mouse.js
import { monthNames } from '@/models/Month';

export function monthRange(task: Task) {
  const startMonth = monthNames[task!.monthStart];
  const endMonth = monthNames[task!.monthEnd];

  return startMonth == endMonth
    ? `(${startMonth})` 
    : `(${startMonth} - ${endMonth})`;
}

export function sectionsForMonth(sections: Section[], month: number, tagFilter: string[] = [], sortBy: string = "", checkedFilter: string = "Any") {
  var sections = sections.filter((section) => 
    taskForMonth(section, month, checkedFilter).length > 0 &&
    (tagFilter.length == 0 || section.tags.some(t => tagFilter.includes(t.name))));

  if (sortBy == "Alphabetically") {
    sections.sort((a, b) => ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0)))
  }

  return sections;
}

export function taskForMonth(section: Section, month: number, checkedFilter: string = "Any") {
  return section.rows.flatMap(s => s.tasks).filter((s) => {
    const isCorrectMonth = s.monthStart <= month && s.monthEnd >= month;
    const passesCheckFilter = checkedFilter == "Any" || 
      checkedFilter == "Checked" && s.checked || 
      checkedFilter == "Unchecked" && !s.checked;

    return isCorrectMonth && passesCheckFilter;
  });
}