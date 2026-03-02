<template>
	<div class="month-list">
    <DisplayOptions class="options" v-model:sortBy="sortBy" v-model:tagFilter="tagFilter" v-model:checkedFilter="checkedFilter" />

    <div v-for="(section, i) in sectionsForMonth(sections, month, tagFilter, sortBy, checkedFilter)" :key="section.name + i" >
      <EditSectionDialog :visible="isSectionVisible(i)" @update:visible="editSectionVisible[i] = $event" :section="section"></EditSectionDialog>

      <h3>
        <span class="section-name">{{ section.name }} </span>
        <i class="pi pi-pencil edit" @click="editSectionVisible[i] = true"></i>
        <template v-if="section.tags.length > 0" class="tag-list">
          <template v-for="tag in section.tags">
            <Tag class="tag" :label="tag.name" severity="success" >{{ tag.name }}</Tag>
          </template>
        </template>
      </h3>
      
      <div class="section-task" >
        <div v-for="(task, j) in taskForMonth(section, month, checkedFilter)" :style="{ borderLeft: '4px solid #' + task.color }" class="section-list-item" >
          <EditTaskDialog :visible="isTaskVisible(i, j)" @update:visible="editTaskVisible[`${i}-${j}`] = $event" :task="task" :section="section"></EditTaskDialog>
          <div class="task-header">
            <Checkbox v-model="task.checked" binary />
            <b class="task-title">{{ task.note }}  
              <span class="month-range" severity="success">
                {{ monthRange(task) }}
              </span>
            </b>
            <i class="pi pi-pencil edit" @click="editTaskVisible[`${i}-${j}`] = true"></i>
          </div>
          <p v-if="task.description" class="description">{{task.description}}</p>
        </div>
      </div>
    </div>
	</div>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';
import { computed, ref, type Ref } from 'vue';
import { monthRange, sectionsForMonth, taskForMonth } from './MonthList'
import EditSectionDialog from '../Dialogs/EditSectionDialog.vue';
import { MultiSelect, Select } from 'primevue';
import { useCalendarStore } from '@/stores/Calendar';
import FloatLabel from 'primevue/floatlabel';
import DisplayOptions from './DisplayOptions.vue'
import EditTaskDialog from '../Dialogs/EditTaskDialog.vue';
import Checkbox from 'primevue/checkbox';

const editSectionVisible : Ref<Record<number, boolean>> = ref({})
const editTaskVisible : Ref<Record<string, boolean>> = ref({})
const sortBy = ref<string>("Calendar order")
const tagFilter = ref<string[]>([])
const checkedFilter = ref<string>("Any")

const store = useCalendarStore()

defineProps<{
	sections: Section[];
	month: number;
}>()

const isSectionVisible = (i: any) => { return editSectionVisible.value[i] || false }
const isTaskVisible = (i: any, j: any) => { return editTaskVisible.value[`${i}-${j}`] || false }

</script>

<style scoped>
h3 {
  font-family: 'Montserrat', sans-serif;
}

.options {
  margin-bottom: 2em;
}

.section-name {
  margin-right: 0.5em;
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

.edit {
  margin-right: 1em;
  color: var(--p-gray-400);
  cursor: pointer;
}

.task-header {
  display: flex;
  gap: 1em;
  align-items: center;
}
</style>
