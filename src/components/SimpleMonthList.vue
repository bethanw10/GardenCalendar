<template>
	<div class="month-list">
		<div class="section" v-for="(section, i) in sectionsForMonth(sections, month)" :key="section.name" >
			<Panel class="section-task" :header="section.name">
				<template #header>
				<div class="header">
					<div class="section-title">{{ section.name }}<i class="pi pi-pencil edit" @click="visible[i] = true"></i></div>
					<div v-if="section.tags.length > 0">
					<span class="tag-text">{{ tagText(section.tags) }}</span>
					</div>
				</div>
				</template>
				<EditSectionDialog v-model:visible="visible[i]" :section="section"></EditSectionDialog>
				<ul>
					<li v-for="task in taskForMonth(section, month)"  class="section-list-item" >
						<p>{{ task.note }} 
						<Tag class="month-range" rounded severity="secondary">
							{{ monthRange(task) }}
						</Tag>
						</p>
					</li>
				</ul>
			</Panel>
		</div>
	</div>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { Panel } from 'primevue';
import EditSectionDialog from './EditSectionDialog.vue';
import { monthNames } from '@/models/Month';
import { ref, type Ref } from 'vue';
import ToggleButton from 'primevue/togglebutton';
const visible : Ref<boolean[]> = ref([])

defineProps<{
	sections: Section[];
	month: number;
}>()

function tagText(tags: Tag[]) {
  return tags.map(t => t.name).join(", ")
}

function monthRange(task: Task) {
  const startMonth = monthNames[task!.monthStart];
  const endMonth = monthNames[task!.monthEnd];

  return startMonth == endMonth
    ? startMonth 
    : `${startMonth} - ${endMonth}`;
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

.header {
  width: 100%;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
}

.edit {
  color: var(--p-gray-400);
  cursor: pointer;
  padding: 0.5em;
}

.month-list {
  /* display: flex; */
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1em;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 30rem;
  padding: 0 5%;
}

.section {
  flex-shrink: 0;
}

.section-list-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  gap: 1rem;
}


.spacer, .jump-button {
  flex: 1;
}

.section-list {
  display: flex;
  flex-direction: column;
  padding: 0 10%;
  border-radius: 8px;
  min-height: 100vh;
}

.section-task {
  height: 100%;
}

.month-range {
  margin-left: 0.5rem;
}

.tag-list {
  display: inline;
}

.tag-text {
  color: var(--p-gray-400);
  font-size: 14px;
}
</style>
