<template>
	<div class="month-list">
    <div v-for="section in sectionsForMonth(sections, month)" :key="section.name" >
      <h3>
        <span class="section-name">{{ section.name }} </span>
        <template v-if="section.tags.length > 0" class="tag-list">
          <template v-for="tag in section.tags">
            <Tag class="tag" :label="tag.name" severity="success" >{{ tag.name }}</Tag>
          </template>
        </template>
      </h3>
      
      <div class="section-task" >
        <div v-for="task in taskForMonth(section, month)" :style="{ borderLeft: '4px solid #' + task.color }" class="section-list-item" >
          <b>{{ task.note }} 
            <span class="month-range" severity="success">
              {{ monthRange(task) }}
            </span>
          </b>
          <p v-if="task.description" class="description">{{task.description}}</p>
        </div>
      </div>
    </div>
	</div>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { Chip } from 'primevue';
import EditSectionDialog from './EditSectionDialog.vue';
import { monthNames } from '@/models/Month';
import { ref, type Ref } from 'vue';
const visible : Ref<boolean[]> = ref([])

defineProps<{
	sections: Section[];
	month: number;
}>()

function monthRange(task: Task) {
  const startMonth = monthNames[task!.monthStart];
  const endMonth = monthNames[task!.monthEnd];

  return startMonth == endMonth
    ? `(${startMonth})` 
    : `(${startMonth} - ${endMonth})`;
}

function sectionsForMonth(sections: Section[], month: number) {
  return sections.filter((section) => 
    section.rows.flatMap(s => s.tasks).some((s) => 
      s.monthStart <= month && 
      s.monthEnd >= month));
}

function taskForMonth(section: Section, month: number) {
  return section.rows.flatMap(s => s.tasks).filter((s) =>
      s.monthStart <= month && 
      s.monthEnd >= month);
}
</script>

<style scoped>
h3 {
  font-family: 'Montserrat', sans-serif;
}

.month-list {
  padding: 0 5%;
}

.section-name {
  margin-right: 1em;
}

.section-list-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  gap: 1rem;
}

.section-list-item {
  font-family: 'Segoe UI';
  margin: 0.5rem 0;
  padding: 0.5rem 0.5rem 0 1rem;
  border-radius: 8px;
  /* border: 1px solid #ccc; */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);;
  background: white;
  margin: 1rem 0;
  padding: 1rem;
}

.section-task {
  margin: 0 0 3rem 0;
}

.month-range {
  margin-left: 0.5rem;
  font-weight: 200;
}

.description {
  font-size: 0.9rem;
  color: #555;
  white-space: pre-line;
  margin: 0.5em 0 0 0;
}

.tag-list {
  display: inline;
}

.tag {
  /* background: var(--p-gray-500); */
}
</style>
