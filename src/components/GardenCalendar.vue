<template>
  <div class="calendar">
    <div class="calendar-grid">
      <div class="spacer"></div>
      <div v-for="month in months" :key="month" class="month-header">
        <b>{{ month.toUpperCase() }}</b>
      </div>
      <i class="pi delete-spacer" ></i>

      <template v-for="(task, i) in store.calendar" :key="i">
        <Textarea autoResize rows="1" style="resize: none" size="small" type="text" class="task-name" v-model="task.name" />

        <template v-for="month in months" :key="month" >
          <template v-if="!!sectionAtMonth(task, month)"  >
            <TaskSection :section="sectionAtMonth(task, month)!" :task="task"/>
          </template>
          <div v-else-if="emptyMonth(task, month)" @click="newSection(task, month)" class="add-block">
            <i class="pi pi-plus-circle add-task"></i>
          </div>
        </template>

        <i class="pi pi-times delete-row" @click="deleteTask(task)"></i>
      </template>
    </div>

    <div class="add-row">
      <Button @click="newRow" icon="pi pi-plus" severity="success"></Button>
    </div>
  </div>
  <MonthTaskList :tasks="store.calendar" />
</template>

<script setup lang="ts">

import { ref, computed, reactive, type Ref } from "vue"
import { Month, months } from "./Month"
import TaskSection from './TaskRow.vue'
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import MonthTaskList from './MonthTaskList.vue'
import { useCalendarStore } from '@/stores/Calendar'
import Button from 'primevue/button';
import type { vertical } from "@primeuix/themes/aura/divider";

const store = useCalendarStore()

// const calendar : Ref<Task[]> = computed(() => {
//   return store.calendar;
// })


// const tasks : Ref<Task[]> = ref([
//     {
//       name: "Tomatoes",
//       sections: [
//         { note: "Prune", color: "add8e6", monthStart: Month.Jan, monthEnd: Month.Mar, description: "Prune prune prune" }, 
//         { note: "Plant", color: "6a5acd", monthStart: Month.Apr, monthEnd: Month.Jun, description: "" }
//       ]
//     },
//     {
//       name: "Strawbs",
//       description: "",
//       sections: [
//         { note: "Test", color: "ee82ee", monthStart: Month.Jan, monthEnd: Month.Dec, description: ""}
//       ]
//     }
//   ]);

function sectionAtMonth(task: Task, month: string) {
  var monthIndex = months.value.indexOf(month);

  return task.sections.find((s) => s.monthStart == monthIndex);
}

function emptyMonth(task: Task, month: string) {
  var monthIndex = months.value.indexOf(month);

  return !task.sections.some((s) => s.monthStart <= monthIndex && s.monthEnd >= monthIndex);
}

function newRow() {
  store.calendar.push({
    name: "Untitled",
    sections: []
  });
}

function newSection(task: Task, month: string) {
  var monthIndex = months.value.indexOf(month);

  task.sections.push({
      monthStart: monthIndex,
      monthEnd: monthIndex,
      color: "aaaaaa",
      note: "",
      description: ""
  });

  task.sections.sort((a, b) => a.monthStart - b.monthStart);
}

function deleteTask(task: Task) {
  var index = store.calendar.indexOf(task);
  store.calendar.splice(index, 1);
}
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  margin: 1rem;
  padding: 1rem 0;
  border-radius: 8px;

  /* border: 1px solid #ccc; */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);;
}

.calendar-grid {
  display: grid;
  grid-template-columns: auto repeat(12, 1fr) auto;
  grid-auto-rows: auto;
  grid-gap: 10px;
  text-align: center;
  align-items: center;
  width: 100%;
}

.month-header {
  align-self: end;
  font-family: 'Raleway', sans-serif;
  font-size: 15px;
  font-weight: 200;
  top: 0;
  position: sticky;
  background: white;
  z-index: 2;
  /* font-weight: 200; */
  /* color: #195253; */
}

.spacer {
  height: 100%;
}

.spacer, .task-name {
  width: 175px;
  background: white;
  position: sticky;
  left: 0;
  z-index: 1;
}

.task-name {
  font-weight: 600;
  text-align: right;
  grid-column-start: 1;
  font-size: 16px;
  max-width: 175px;
  font-family: 'Montserrat', sans-serif;
  width: 100%;
  border: none;
  text-overflow: ellipsis;
  color: #333;
  /* border-bottom: 1px solid #666; */
}

.delete-spacer {
  width: 1em;
}

.delete-spacer, .delete-row {
  margin: 1.5em;
}

.delete-row {
  color: #cd6565;
  font-size: 1em;
  cursor: pointer;
  justify-self: flex-start;
}

.add-block {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-task {
  font-size: 20px;
  color: #c1c4cf;
  cursor: pointer;
}

.add-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0 0 0;
}

.add-button {
  font-family: "Roboto";
  --md-sys-color-primary: #191C1C;
}
</style>
