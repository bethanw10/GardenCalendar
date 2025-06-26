<template>
  <div class="calendar" v-show="!showMonthList">
    <div class="calendar-grid" :class="expanded ? 'expanded' : ''">
      <div class="spacer">
        <!-- <Button rounded 
          @click="expanded = !expanded" 
          :icon="expanded ? 'pi pi-window-minimize': 'pi pi-window-maximize'"
          :title="expanded ? 'Fit to screen': 'Expand'"
          severity="secondary">
        </Button> -->
      </div>
      <div class="months">
        <template v-for="month in monthNames" :key="month">
          <b class="month-header">{{ month.toUpperCase() }}</b>
        </template>
      </div>
      <div class="options" >
        <!-- <Button type="button" text icon="pi pi-ellipsis-v" @click="toggleCalendarOptions" severity="secondary"  aria-haspopup="true" aria-controls="overlay_menu" ></Button> -->
        <Button type="button" icon="pi pi-cog" @click="toggleCalendarOptions" severity="secondary"  aria-haspopup="true" aria-controls="overlay_menu" ></Button>
        
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

    <div class="bottom-options">
      <div></div>
      <div class="add-row">
        <Button label="New Section" size="small" @click="newSection" icon="pi pi-plus" severity="primary"></Button>
      </div>
      <div class="to-month-list">
        <Button @click="showMonthList = true" size="small" label="Tasks" icon="pi pi-angle-right" icon-pos="right" outlined severity="primary"></Button>
      </div>
    </div>
  </div>

  <Button class="back-button" @click="showMonthList = false" size="small" v-show="showMonthList" label="Calendar" icon="pi pi-angle-left" icon-pos="left" outlined severity="primary"></Button>
  <Overview v-show="showMonthList" :sections="store.calendar" />
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
import Overview from "./MonthlyOverview/MonthlyOverview.vue"
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const store = useCalendarStore()
const menu = ref()
const showImport = ref(false)
const showExport = ref(false)
const expanded = ref(false)
const showMonthList = ref(false)
const importText = ref("")

const calendarOptions = computed(() => {
  var items = [{
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
    }]

  if (isDesktop()) {
    items.push({
      label: expanded.value ? 'Fit to screen' : 'Expand',
      icon: expanded.value ? 'pi pi-window-minimize': 'pi pi-window-maximize',
      command: (e : any) => {
        expanded.value = !expanded.value 
      },
    })
  }

  return [
  {
    label: "Options",
    items: items
  }]
})

const toggleCalendarOptions = (event: any) => { menu.value.toggle(event) }

const isDesktop = () => { return width.value > 1440 }

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
  padding: 1rem;
  border-radius: 8px;
  max-height: calc(100vh - 2rem);

  /* border: 1px solid #ccc; */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);

  --fit-grid-columns: repeat(12, minmax(0, 1fr));
  /* height: auto; */
}

.calendar-grid {
  display: grid;
  grid-template-columns: minmax(auto, 10vw) var(--fit-grid-columns) auto;
  grid-gap: 10px;
  text-align: center;
  align-items: stretch;
  width: 100%;
  height: auto;
  background: white;
  overflow-y: scroll;
}

.months {
  display: grid;
  grid-template-columns: var(--fit-grid-columns);
  grid-column: 2 / 14;
  grid-gap: 10px;
  top: 0;
  position: sticky;
  background: white;
  z-index: 3;
  height: auto;
}

/* 
@media only screen and (max-width: 800) {
  .calendar-grid {
    grid-template-columns: auto repeat(12, 10rem) auto;
  }
} */

.calendar-grid.expanded {
  grid-template-columns: auto repeat(12, max(10vw, 10rem)) auto;
  overflow: scroll;
  max-height: 80vh;
}

.spacer {
  width: 100%;
  /* left: 0; */
  /* left: 0; */
  top: 0;
  position: sticky;
  background: white;
  z-index: 5;
  z-index: 5;
  display: flex;
  justify-content: start;
}

.month-header {
  align-self: end;
  font-family: 'Raleway', sans-serif;
  font-size: 15px;
  font-weight: 200;
}

.options {
  width: 100%;
  top: 0;
  position: sticky;
  background: white;
  z-index: 3;
  display: flex;
  justify-content: end;
  padding: .5em .5em 0;
  display: flex;
  justify-content: end;
  padding: .5em .5em 0;
}

.add-row {
  display: flex;
  align-items: center;
  justify-content: center;
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

.bottom-options {
  display: flex;
  align-items: center;
  margin: 1rem 0 0 0;
  width: 100%;
  justify-content: space-between;
}

.bottom-options > * {
  flex: 1
}

.to-month-list {
  display: flex;
  justify-content: end;
}

.back-button {
  margin: 1em 1em 0 1em;
}

.bottom-options {
  display: flex;
  align-items: center;
  margin: 1rem 0 0 0;
  width: 100%;
  justify-content: space-between;
}

.bottom-options > * {
  flex: 1
}

.to-month-list {
  display: flex;
  justify-content: end;
}

.back-button {
  margin: 1em 1em 0 1em;
}

@media only screen and (max-width: 1440px) {
  .calendar {
    margin: 0;
    padding: 0;
    background-color: #f1f5f9;
  }

  .calendar-grid {
    grid-template-columns: minmax(auto, 8em) repeat(12, 7rem) auto;
    overflow-y: scroll;
    grid-gap: 5px;
  }

  .months {
    grid-template-columns: repeat(12, 7rem);
    grid-template-columns: repeat(12, 7rem);
    grid-gap: 5px;
  }

  /* .spacer {
  /* .spacer {
    background: transparent !important; 
  } */
  } */
}
</style>
