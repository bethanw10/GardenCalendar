<template>
  <DisplayOptions class="options" v-model:sortBy="sortBy" v-model:tagFilter="tagFilter" />

	<div class="month-list">

		<div class="section" v-for="(section, i) in sectionsForMonth(sections, month, tagFilter, sortBy)" :key="section.name + i" >
			<Panel class="section-task" :header="section.name">
				<template #header>
          <div class="header">
            <div class="section-title">{{ section.name }}<Button size="small" rounded text severity="secondary" icon="pi pi-pencil edit" @click="visible[i] = true"></Button></div>
            <div v-if="section.tags.length > 0">
            <span class="tag-text">{{ tagText(section.tags) }}</span>
            </div>
          </div>
				</template>
				<EditSectionDialog v-model:visible="visible[i]" :section="section"></EditSectionDialog>
				<ul>
					<li v-for="task in taskForMonth(section, month)" class="section-list-item" >
						<p>
							<span class="task-note">{{ task.note }} </span>
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
import { Panel } from 'primevue';
import EditSectionDialog from '../Dialogs/EditSectionDialog.vue';
import { onMounted, ref, type Ref } from 'vue';
import { monthRange, sectionsForMonth, taskForMonth } from './MonthList'
import DisplayOptions from './DisplayOptions.vue'
import Button from 'primevue/button';

const visible : Ref<boolean[]> = ref([])
const sortBy = ref<string>("Calendar order")
const tagFilter = ref<string[]>([])

let props = defineProps<{
	sections: Section[];
	month: number;
}>()

function tagText(tags: Tag[]) {
  return tags.map(t => t.name).join(", ")
}

onMounted(() => {
  for (let i = 0; i < props.sections.length; i++) {
    visible.value[i] == false;
  }
})
</script>

<style scoped>
h3 {
  font-family: 'Montserrat', sans-serif;
}

.header {
  width: 100%;
}

.options {
  margin-bottom: 2em;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 1em;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 30rem;
}

@media only screen and (max-width: 1440px) {
  .month-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media only screen and (max-width: 800px) {
  .month-list {
    grid-template-columns: repeat(1, 1fr);
  }
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

.task-note {
	margin-right: 0.5rem;
}

.tag-list {
  display: inline;
}

.tag-text {
  color: var(--p-gray-400);
  font-size: 14px;
}
</style>
