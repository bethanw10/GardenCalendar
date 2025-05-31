<template>
	<div class="task-list">
	    <div class="task-list-header">
        <div class="spacer"></div>
        <div class="month-nav">
          <div @click="prevMonth()" class="month-arrow"><i class="pi pi-angle-left"></i> </div>
          <p class="month-title">{{ months[month] }}</p>
          <div @click="nextMonth()" class="month-arrow"><i class="pi pi-angle-right"></i></div>
        </div>
        <div class="jump-button">
          <Button @click="jumpToThisMonth" :disabled="month == currentMonth" label="Today" size="small" outlined rounded title="Jump to this month"></Button>
        </div>
		  </div>
	    <div v-for="task in tasksForMonth(tasks, month)" :key="task.name" >
	      <h3>{{ task.name }}</h3>
	      <div class="task-section" >
          <div v-for="section in sectionForMonth(task, month)" :style="{ borderLeft: '4px solid #' + section.color }" class="task-list-item" >
            <b>{{ section.note }} 
              <Tag class="month-range" severity="secondary">
                {{ monthRange(section, month) }}
              </Tag>
            </b>
            <p class="description">{{section.description}}</p>
          </div>
	      </div>
	    </div>
	  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { months } from './Month';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

defineProps<{ 
	tasks: Task[];
}>()

const month = ref(1)

onMounted(() => {
  month.value = currentMonth.value;
})

const currentMonth = computed(() => {
  const date = new Date();
  return date.getMonth();
})

function monthRange(section: Section, month: number) {
  const startMonth = months[section!.monthStart];
  const endMonth = months[section!.monthEnd];

  return startMonth == endMonth
    ? startMonth 
    : `${startMonth} - ${endMonth}`;
}

function prevMonth() {
  month.value = (month.value - 1 + months.length) % months.length;
}

function nextMonth() {
  month.value =(month.value + 1) % months.length;
}

function jumpToThisMonth() {
  month.value = currentMonth.value;
}

function tasksForMonth(tasks: Task[], month: number) {
  return tasks.filter((task) => 
    task.rows.flatMap(s => s.sections).some((s) => 
      s.monthStart <= month && 
      s.monthEnd >= month));
}

function sectionForMonth(task: Task, month: number) {
  return task.rows.flatMap(s => s.sections).filter((s) =>
      s.monthStart <= month && 
      s.monthEnd >= month);
}
</script>

<style scoped>
h3 {
  font-family: 'Montserrat', sans-serif;
}

.month-title {
  width: 3rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 500;
}

.month-arrow {
  cursor: pointer;
  font-size: 1.5rem;
  min-width: 30px;
  text-align: center;
}

.task-list-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  gap: 1rem;
}

.month-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 0
}

.spacer, .jump-button {
  flex: 1;
}

.task-list {
  display: flex;
  flex-direction: column;
  padding: 0 10%;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 5rem;
}

.task-list-item {
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

.task-section {
  margin: 0 0 2rem 0;
}

.month-range {
  margin-left: 0.5rem;
}

.description {
  font-size: 0.9rem;
  color: #555;
  white-space: pre-line;
  margin: 0.5em 0 0 0;
}
</style>
