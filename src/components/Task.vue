<template>
	<div class="task" :style="blockStyle(task)">
		<div class="month-span-controls">
      <div class="add" :class="isPrevMonthOpen(row.tasks, task.monthStart) ? 'clickable' : ''">
        <div v-if="isPrevMonthOpen(row.tasks, task.monthStart)" @click="addPrevMonth(task)"><i class="pi pi-angle-left"></i> </div>
      </div> 
      <div class="add" :class="task.monthStart != task.monthEnd ? 'clickable' : ''">
        <div v-if="task.monthStart != task.monthEnd" @click="removeStartMonth(task)"> <i class="pi pi-angle-right"></i> </div>
      </div> 
		</div>
    <div class="options">
		  <InputText class="task-note" size="small" v-model="task.note" />
      <div class="icon-panel">
        <i class="pi pi-pencil edit" @click="visible = true"></i>
        <i class="pi pi-trash delete" @click="deleteTask(row, task)"></i>

        <EditTaskDialog :task="task" v-model:visible="visible" />        
      </div>
    </div>
		<div class="month-span-controls">
      <div class="add" :class="isNextMonthOpen(row.tasks, task.monthEnd) ? 'clickable' : ''">
        <div v-if="isNextMonthOpen(row.tasks, task.monthEnd)" @click="addNextMonth(task)"><i class="pi pi-angle-right"></i></div>
      </div> 
      <div class="add" :class="task.monthStart != task.monthEnd ? 'clickable' : ''" >
        <div v-if="task.monthStart != task.monthEnd" @click="removeEndMonth(task)"> <i class="pi pi-angle-left"></i> </div>
      </div> 
		</div>
	</div>
  
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue';
import { Month } from '../models/Month';
import InputText from 'primevue/inputtext';
import EditTaskDialog from './Dialogs/EditTaskDialog.vue'

defineProps<{ 
	row: Row;
	task: Task;
}>()

const visible = ref(false);

function blockStyle(task: any) {
  const offset = 2;

  return reactive({
    'grid-column': `${task.monthStart + offset}/${task.monthEnd + offset + 1}`,
    'background': "#" + task.color
  })
}

function addPrevMonth(task: Task) {
  if (task.monthStart == Month.Jan) {
    task.monthStart = Month.Dec;
    // section.tasks.push({ 
    //   ...task, 
    //   monthStart: Month.Dec, 
    //   monthEnd: Month.Dec })
  } else {
    task.monthStart--;
  }
}

function addNextMonth(task: Task) {
  if (task.monthEnd == Month.Dec) {
    task.monthEnd = Month.Jan;
    // section.tasks.push({ 
    //   ...task, 
    //   monthStart: Month.Jan, 
    //   monthEnd: Month.Jan })
  } else {
    task.monthEnd++;
  }
}

function removeStartMonth(task: Task) {
  task.monthStart++;
}

function removeEndMonth(task: Task) {
  task.monthEnd--;
}

function isPrevMonthOpen(tasks: Task[], month: Month) : boolean {
  if (month == Month.Jan) {
    return false;
    //return tasks.some((task) => task.monthEnd == Month.Dec);
  }

  return !tasks.some((task) => task.monthEnd == month - 1);
}

function isNextMonthOpen(tasks: Task[], month: Month) : boolean {
  if (month == Month.Dec) {
    return false
    //return tasks.some((task) => task.monthStart == Month.Jan);
  }

  return !tasks.some((task) => task.monthStart == month + 1);
}

function deleteTask(row: Row, task: Task) {
  var index = row.tasks.indexOf(task);
  row.tasks.splice(index, 1);
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
  font-size: 14px;
  font-family: 'Segoe UI';
  box-shadow: none;
  font-weight: 600;
  color: white;
  text-overflow: ellipsis;
  padding-left:0;
  padding-right: 0;
}

.task {
  height: 100%;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
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
