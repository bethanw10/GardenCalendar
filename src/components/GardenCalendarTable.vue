<template>
  <div class="calendar">
    <div class="calendar-grid">
      <div class="spacer"> </div>
      <div class="months">
        <template v-for="month in monthNames" :key="month" class="month-header">
          <b>{{ month.toUpperCase() }}</b>
        </template>
      </div>
      <div class="options" >
        <Button type="button" text icon="pi pi-ellipsis-v" @click="toggleCalendarOptions" severity="secondary"  aria-haspopup="true" aria-controls="overlay_menu" ></Button>
        <Menu ref="menu" id="overlay_menu" :model="calendarOptions" :popup="true" ></Menu>
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

      <template v-for="(section, i) in store.calendar" :key="i">
        <Section :section="section" > </Section>
      </template>
    </div>

    <div class="add-row">
      <Button label="New Section" @click="newSection" icon="pi pi-plus" severity="success"></Button>
    </div>
  </div>
  <Overview :sections="store.calendar" />
</template>

<script setup lang="ts">

import { ref, computed } from "vue"
import { monthNames } from "../models/Month"
import { useCalendarStore } from '@/stores/Calendar'
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Section from './Section.vue'
import Overview from "./MonthlyOverview.vue"

const store = useCalendarStore()
const menu = ref()
const showImport = ref(false)
const showExport = ref(false)
const importText = ref("")

const calendarOptions = computed(() => [
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
}])

const toggleCalendarOptions = (event: any) => { menu.value.toggle(event) }

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

function newSection() {
  store.calendar.push({
    name: "Untitled",
    tags: [],
    rows: [ { tasks: []} ]
  });
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

.calendar-grid:nth-child(1n){
  background-color: palevioletred;
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
  width: 175px;
  background: white;
  position: sticky;
  left: 0;
  z-index: 1;
}

.options {
  width: 100%;
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
