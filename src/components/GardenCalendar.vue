<template>
  <div class="calendar">
    <div class="calendar-grid">
      <div class="spacer"> </div>
      <div v-for="month in months" :key="month" class="month-header">
        <b>{{ month.toUpperCase() }}</b>
      </div>
      <div class="options" >
        <Button type="button" text icon="pi pi-ellipsis-v" @click="toggle" severity="secondary"  aria-haspopup="true" aria-controls="overlay_menu" ></Button>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" ></Menu>
        <Dialog v-model:visible="showImport" maximizable modal header="Import" class="edit-dialog" >
          <Textarea v-model="importText" rows="10" cols="100" style="resize: none" ></Textarea>
          <div class="export-buttons">
            <Button label="Load" @click="importCalendar"></Button>
            <Button label="Close" severity="secondary" @click="showImport = false"></Button>
          </div>
        </Dialog>
        <Dialog v-model:visible="showExport" maximizable modal header="Export" class="edit-dialog" >
          <Textarea :modelValue="store.calendarJson" readonly rows="10" cols="100" style="resize: none" ></Textarea>
          <div class="export-buttons">
            <Button label="Copy" @click="copyExport"></Button>
            <Button label="Close" severity="secondary" @click="showExport = false"></Button>
          </div>
        </Dialog>
      </div>

      <template v-for="(task, i) in store.calendar" :key="i">
        <div class="task-options" :style="taskNameStyle(task, i)">
          <Textarea  autoResize rows="1" style="resize: none" size="small" type="text" class="task-name" v-model="task.name" />
          <Button @click="newRow(task)" title="Add Row" text icon="pi pi-caret-down"></Button>
        </div>
        <template v-for="(row, j) in task.rows" :key="j">
          <template v-for="month in months" :key="month" >
            <template v-if="!!sectionAtMonth(row, month)"  >
              <TaskSection :section="sectionAtMonth(row, month)" :row="row"/>
            </template>
            <div v-else-if="emptyMonth(row, month)" @click="newSection(row, month)" class="add-block">
              <i class="pi pi-plus-circle add-task"></i>
            </div>
          </template>
          <i class="pi pi-times delete-row" @click="deleteRow(task, row)"></i>
        </template>

      </template>
    </div>

    <div class="add-row">
      <Button title="Add new section" @click="newTask" icon="pi pi-plus" severity="success"></Button>
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
import Menu from 'primevue/menu';
import MonthTaskList from './MonthTaskList.vue'
import { useCalendarStore } from '@/stores/Calendar'
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const store = useCalendarStore()
const menu = ref()
const showImport = ref(false)
const showExport = ref(false)
const importText = ref("")
const items = computed(() => [
{
  
  label: "Options",
  items: [
    {
      label: 'Import',
      icon: 'pi pi-download',
      command: (e : any) => {
        showImport.value = true;
      },
    },
    {
      label: 'Export',
      icon: 'pi pi-upload',
      command: (e : any) => {
        showExport.value = true;
      },
    },
  ],
},
])

const toggle = (event: any) => {
  menu.value.toggle(event)
}

async function copyExport() {
  try {
      await navigator.clipboard.writeText(store.calendarJson);
    } catch($e) {
      alert('Cannot copy');
  }
}

function importCalendar() {
  try {
    store.import(importText.value);
    showImport.value = false;
  } catch($e: any) {
    alert('Failed to import: ' + $e.message);
  }
}

function sectionAtMonth(row: Row, month: string) {
  var monthIndex = months.indexOf(month);

  return row.sections.find((s) => s.monthStart == monthIndex);
}

function emptyMonth(row: Row, month: string) {
  var monthIndex = months.indexOf(month);

  return !row.sections.some((s) => s.monthStart <= monthIndex && s.monthEnd >= monthIndex);
}

function newTask() {
  store.calendar.push({
    name: "Untitled",
    rows: [ { sections: [] } ]
  });
}

function newRow(task: Task) {
  task.rows.push( { sections: [] });
}

function newSection(row: Row, month: string) {
  var monthIndex = months.indexOf(month);

  row.sections.push({
      monthStart: monthIndex,
      monthEnd: monthIndex,
      color: "aaaaaa",
      note: "",
      description: ""
  });

  row.sections.sort((a, b) => a.monthStart - b.monthStart);
}

function deleteRow(task: Task, row: Row) {
  if (task.rows.length == 1) {
    var index = store.calendar.indexOf(task);
    store.calendar.splice(index, 1);
  } else {
    var index = task.rows.indexOf(row);
    task.rows.splice(index, 1)
  }
}

function taskNameStyle(task: any) {
  var index = 0;
  for(var t of store.calendar) {
    if (t == task) {
      break;
    }
    
    index += t.rows.length
  }

  var offset = 2;
  return reactive({
    'grid-row': `${index + offset}/${task.rows.length + index + offset}`
  })
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

.task-options {
  display: flex;
  align-items: baseline;
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

.options {
  width: 100%;
}

.delete-row {
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

.button-row {
  display: flex;
  justify-content: center;
}

.export-buttons {
  display: flex;
  justify-content: center;
  gap: 1em;
}
</style>
