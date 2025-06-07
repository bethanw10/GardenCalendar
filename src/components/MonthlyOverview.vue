<template>
	<div class="month-list">
    <div class="header">
      <ToggleButton v-model="useDetailedView" onLabel="Detailed View" offLabel="Simple View" />
      <div class="month-nav">
        <div @click="prevMonth()" class="month-arrow"><i class="pi pi-angle-left"></i> </div>
        <p class="month-title">{{ monthNames[month] }}</p>
        <div @click="nextMonth()" class="month-arrow"><i class="pi pi-angle-right"></i></div>
      </div>
      <div class="jump-button">
        <Button @click="jumpToThisMonth" :disabled="month == currentMonth" label="Today" size="small"  rounded title="Jump to this month"></Button>
      </div>
    </div>
    <DetailedMonthList v-if="useDetailedView" :sections="sections" :month="month" />
    <SimpleMonthList v-else :sections="sections" :month="month" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { monthNames } from '../models/Month';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';
import { Panel } from 'primevue';
import EditSectionDialog from './EditSectionDialog.vue';
import SimpleMonthList from './SimpleMonthList.vue'
import DetailedMonthList from './DetailedMonthList.vue';

const props = defineProps<{ 
	sections: Section[];
}>()

const month = ref(1)
const useDetailedView = ref(true)

onMounted(() => {
  month.value = currentMonth.value;
})

const currentMonth = computed(() => {
  const date = new Date();
  return date.getMonth();
})

function prevMonth() {
  month.value = (month.value - 1 + monthNames.length) % monthNames.length;
}

function nextMonth() {
  month.value =(month.value + 1) % monthNames.length;
}

function jumpToThisMonth() {
  month.value = currentMonth.value;
}


</script>

<style scoped>
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

.header {
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

/* .spacer, .jump-button {
  flex: 1;
} */
</style>
