<template>
    <div class="section-options" :style="sectionNameStyle(section)">
        <Textarea id="section-name" autoResize rows="1" style="resize: none" size="small" type="text"  v-model="section.name"></Textarea>
        <Button @click="toggleTaskOptions" title="Add Row" text icon="pi pi-ellipsis-v"></Button>
        <Menu ref="taskMenu" id="overlay_menu" :model="sectionOptions" :popup="true" ></Menu>
        <EditSectionDialog :section="section" v-model:visible="showModal" />
    </div>
    <template v-for="(row, j) in section.rows" :key="j">
        <template v-for="month in monthNames" :key="month" >
        <Task v-if="!!taskAtMonth(row, month)" :task="taskAtMonth(row, month)!" :row="row"/>
        <div v-else-if="emptyMonth(row, month)" @click="newTask(row, month)" class="add-block">
            <i class="pi pi-plus-circle add-section"></i>
        </div>
        </template>
        <i class="pi pi-times delete-row" @click="deleteRow(section, row)"></i>
    </template>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import Fluid from 'primevue/fluid';
import Task from './Task.vue'
import Textarea from 'primevue/textarea';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { useCalendarStore } from '@/stores/Calendar';
import { monthNames } from "../models/Month"

import EditSectionDialog from './EditSectionDialog.vue'

const props = defineProps<{ 
    section: Section
}>()

const store = useCalendarStore()
const taskMenu = ref()
const showModal = ref(false)

const sectionOptions = computed(() => [
{
  label: "Options",
  items: [
     {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: (e : any) => {
        showModal.value = true;
      },
    },
    {
      label: 'Add row',
      icon: 'pi pi-plus',
      command: (e : any) => {
        newRow(props.section)
      },
    },
    {
      label: 'Move up',
      icon: 'pi pi-caret-up',
      command: (e : any) => {
        moveUp(props.section)
      },
    },
    {
      label: 'Move down',
      icon: 'pi pi-caret-down',
      command: (e : any) => {
        moveDown(props.section)
      },
    },
  ],
}])

const toggleTaskOptions = (event: any, i: number) => { taskMenu.value.toggle(event) }


function deleteRow(section: Section, row: Row) {
  if (section.rows.length == 1) {
    var index = store.calendar.indexOf(section);
    store.calendar.splice(index, 1);
  } else {
    var index = section.rows.indexOf(row);
    section.rows.splice(index, 1)
  }
}

function moveUp(section: Section) {
    var i = store.calendar.indexOf(section);
    store.calendar.splice(i, 1);
    store.calendar.splice(i - 1, 0, section);
}

function moveDown(section: Section) {
    var i = store.calendar.indexOf(section);
    store.calendar.splice(i, 1);
    store.calendar.splice(i + 1, 0, section);
}

function sectionNameStyle(section: any) {
  var index = 0;
  for(var t of store.calendar) {
    if (t == section) {
      break;
    }
    
    index += t.rows.length
  }

  var offset = 2;
  return reactive({
    'grid-row': `${index + offset}/${section.rows.length + index + offset}`
  })
}


function newRow(section: Section) {
    section.rows.push( { tasks: [] });
}

function newTask(row: Row, month: string) {
  var monthIndex = monthNames.indexOf(month);

  row.tasks.push({
      monthStart: monthIndex,
      monthEnd: monthIndex,
      color: "aaaaaa",
      note: "Untitled",
      description: ""
  });

  row.tasks.sort((a, b) => a.monthStart - b.monthStart);
}

function taskAtMonth(row: Row, month: string) {
  var monthIndex = monthNames.indexOf(month);

  return row.tasks.find((s) => s.monthStart == monthIndex);
}

function emptyMonth(row: Row, month: string) {
  var monthIndex = monthNames.indexOf(month);

  return !row.tasks.some((s) => s.monthStart <= monthIndex && s.monthEnd >= monthIndex);
}
</script>

<style>

.section-options {
  display: flex;
  align-items: center;
  position: sticky;
  left: 0;
  z-index: 2;
  height: 100%;
  background: white;
}

#section-name {
  font-weight: 600;
  text-align: right;
  grid-column-start: 1;
  font-size: calc(0.5em + 1vmin);
  max-width: 15vw;
  font-family: 'Montserrat', sans-serif;
  border: none;
  text-overflow: ellipsis;
  color: #333;
  background: white;
  position: sticky;
  left: 0;
  z-index: 1;
}

.add-section {
  font-size: 20px;
  color: #c1c4cf;
  cursor: pointer;
}

.add-block {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>