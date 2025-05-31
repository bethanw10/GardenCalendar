<template>
	<div class="task" :style="blockStyle(section)">
		<div class="month-span-controls">
      <div class="add" :class="isPrevMonthOpen(row.sections, section.monthStart) ? 'clickable' : ''">
        <div v-if="isPrevMonthOpen(row.sections, section.monthStart)" @click="addPrevMonth(section)"><i class="pi pi-angle-left"></i> </div>
      </div> 
      <div class="add" :class="section.monthStart != section.monthEnd ? 'clickable' : ''">
        <div v-if="section.monthStart != section.monthEnd" @click="removeStartMonth(section)"> <i class="pi pi-angle-right"></i> </div>
      </div> 
		</div>
    <div class="options">
		  <InputText class="task-note" size="small" v-model="section.note" />
      <div class="icon-panel">
        <i class="pi pi-pencil edit" @click="visible = true"></i>
        <i class="pi pi-trash delete"@click="deleteSection(row, section)"></i>
        
        <EditTaskDialog :section="section" :visible="visible" />        
      </div>
    </div>
		<div class="month-span-controls">
      <div class="add" :class="isNextMonthOpen(row.sections, section.monthEnd) ? 'clickable' : ''">
        <div v-if="isNextMonthOpen(row.sections, section.monthEnd)" @click="addNextMonth(section)"><i class="pi pi-angle-right"></i></div>
      </div> 
      <div class="add" :class="section.monthStart != section.monthEnd ? 'clickable' : ''" >
        <div v-if="section.monthStart != section.monthEnd" @click="removeEndMonth(section)"> <i class="pi pi-angle-left"></i> </div>
      </div> 
		</div>
	</div>
  
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import { Month } from './Month';
import InputText from 'primevue/inputtext';
import EditTaskDialog from './EditTaskDialog.vue'

defineProps<{ 
	row: Row;
	section: Section;
}>()

const visible = ref(false);

function blockStyle(section: any) {
  const offset = 2;

  return reactive({
    'grid-column': `${section.monthStart + offset}/${section.monthEnd + offset + 1}`,
    'background': "#" + section.color
  })
}

function addPrevMonth(section: Section) {
  if (section.monthStart == Month.Jan) {
    section.monthStart = Month.Dec;
    // task.sections.push({ 
    //   ...section, 
    //   monthStart: Month.Dec, 
    //   monthEnd: Month.Dec })
  } else {
    section.monthStart--;
  }
}

function addNextMonth(section: Section) {
  if (section.monthEnd == Month.Dec) {
    section.monthEnd = Month.Jan;
    // task.sections.push({ 
    //   ...section, 
    //   monthStart: Month.Jan, 
    //   monthEnd: Month.Jan })
  } else {
    section.monthEnd++;
  }
}

function removeStartMonth(section: Section) {
  section.monthStart++;
}

function removeEndMonth(section: Section) {
  section.monthEnd--;
}

function isPrevMonthOpen(sections: Section[], month: Month) : boolean {
  if (month == Month.Jan) {
    return false;
    //return sections.some((section) => section.monthEnd == Month.Dec);
  }

  return !sections.some((section) => section.monthEnd == month - 1);
}

function isNextMonthOpen(sections: Section[], month: Month) : boolean {
  if (month == Month.Dec) {
    return false
    //return sections.some((section) => section.monthStart == Month.Jan);
  }

  return !sections.some((section) => section.monthStart == month + 1);
}

function deleteSection(row: Row, section: Section) {
  var index = row.sections.indexOf(section);
  row.sections.splice(index, 1);
}
</script>

<style scoped>

.month-span-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
}

.task-note {
  width: 100%;
  text-align: center;
  background: transparent;
  border: none;
  /* border-bottom: 2px solid #666; */
  font-size: 16px;
  font-family: 'Segoe UI';
  box-shadow: none;
  font-weight: 600;
  color: white;
  text-overflow: ellipsis;
}

.task {
  height: 100%;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  padding: 10px 0;
  min-height: 50px;
  position: relative;
}

.add {
  width: 30px;
  height: 30px;
  font-weight: 600;
  flex-grow: 1;
}

.clickable {
  cursor: pointer;
}

.edit, .delete {
  cursor: pointer;
}

.delete {
  color: #cd6565;
}

.empty {
  height: 1rem;
}

.options {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  flex-direction: column;
}

.icon-panel {
  background-color: #fff;
  border-radius: 5px;
  width: auto;
  gap: 0.5rem;
  display: flex;
  padding: 0.5rem;
  justify-content: center;
}

</style>
