<template>
	<div class="overview">
    <div class="header">
      <div class="jump-button">
        <Button @click="jumpToThisMonth" :disabled="month == currentMonth" label="Today" size="small"  rounded title="Jump to this month"></Button>
      </div>
      <!-- <ToggleButton v-model="useDetailedView" size="small" onLabel="Detailed" offLabel="Simple" /> -->
      <!-- <ToggleButton v-model="useDetailedView" size="small" onIcon="pi pi-check" offIcon="pi pi-times" onLabel="" offLabel="" /> -->
      <div class="month-nav">
        <div @click="prevMonth()" class="month-arrow"><i class="pi pi-angle-left"></i> </div>
        <p class="month-title">{{ monthNames[month] }}</p>
        <div @click="nextMonth()" class="month-arrow"><i class="pi pi-angle-right"></i></div>
      </div>
      <div class="menu-button">
        <Button type="button" rounded icon="pi pi-ellipsis-v" @click="toggleCalendarOptions" severity="secondary" aria-haspopup="true" ></Button>
        <Menu ref="menu" id="overlay_menu" :model="options" :popup="true" ></Menu>
      </div>
      
    </div>
    <DetailedMonthList v-if="useDetailedView" :sections="sections" :month="month" />
    <SimpleMonthList v-else :sections="sections" :month="month" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { monthNames } from '../../models/Month';
import Button from 'primevue/button';
import SimpleMonthList from './SimpleMonthList.vue'
import DetailedMonthList from './DetailedMonthList.vue';
import Menu from 'primevue/menu';

const menu = ref()
const month = ref(1)
const useDetailedView = ref(true)

const options = computed(() => [
{
  label: "Options",
  items: [
    {
      label: 'Switch view',
      icon: 'pi pi-arrow-right-arrow-left',
      command: (e : any) => {
        useDetailedView.value = !useDetailedView.value
      },
    },
    {
      label: 'Copy as plain text',
      icon: 'pi pi-clipboard',
      command: (e : any) => {
        console.log(plainTextList())
      },
    }
  ],
}])

const toggleCalendarOptions = (event: any) => { menu.value.toggle(event) }

const props = defineProps<{ 
	sections: Section[];
}>()

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

function plainTextList() {
  var text = "";

  var sections = props.sections.filter((section) => 
    section.rows.flatMap(s => s.tasks).some((s) => 
      s.monthStart <= month.value && 
      s.monthEnd >= month.value));

  for (var section of sections) {
    text += section.name + ':\n';

    var tasks = section.rows.flatMap(s => s.tasks).filter((s) =>
      s.monthStart <= month.value && 
      s.monthEnd >= month.value);

      for (var task of tasks) {
        text += task.note + '\n'
      }
      
      text += '\n'
  }

  return text;
}
</script>

<style scoped>
.overview {
  padding: 0 5%;
  
}

@media only screen and (max-width: 1440px) {
	.overview {
		grid-template-columns: repeat(2, 1fr);
		padding: 0 1rem;
	}
}

@media only screen and (max-width: 800px) {
	.overview {
		grid-template-columns: repeat(1, 1fr);
	}
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

.menu-button, .jump-button {
  flex: 1;
  justify-content: flex-end;
  width: 100%;
  display: flex;
}

/* .spacer, .jump-button {
  flex: 1;
} */
</style>
