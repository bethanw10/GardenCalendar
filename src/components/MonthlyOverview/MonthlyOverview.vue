<template>
	<div class="overview">
    <div class="header">
      <div class="to-month-list">
      </div>
      <div class="jump-button">

        <Button @click="jumpToThisMonth" :disabled="month == currentMonth" label="Today" size="small"  rounded title="Jump to this month"></Button>
      </div>

      <div class="month-nav">
        <div @click="prevMonth()" class="month-arrow"><i class="pi pi-angle-left"></i> </div>
        <p class="month-title">{{ monthNames[month] }}</p>
        <div @click="nextMonth()" class="month-arrow"><i class="pi pi-angle-right"></i></div>
      </div>
      <div class="menu-button">
        <Button type="button" size="large" icon="pi pi-cog" @click="toggleCalendarOptions" severity="secondary" aria-haspopup="true" ></Button>
        <Menu ref="menu" id="overlay_menu" :model="options" :popup="true" ></Menu>
      </div>
      
    </div>
    <DetailedMonthList v-if="useDetailedView == 'Detailed'" :sections="sections" :month="month" />
    <SimpleMonthList v-if="useDetailedView == 'Simple'" :sections="sections" :month="month" />
    <TextMonthList v-if="useDetailedView == 'Text'" :sections="sections" :month="month" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { monthNames } from '../../models/Month';
import Button from 'primevue/button';
import SimpleMonthList from './SimpleMonthList.vue'
import DetailedMonthList from './DetailedMonthList.vue';
import Menu from 'primevue/menu';
import TextMonthList from './TextMonthList.vue';
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const menu = ref()
const month = ref(1)
const useDetailedView = ref("Detailed")

const options = computed(() => {
  var viewItems = [
  {
    label: 'Simple view',
    icon: 'pi pi-th-large',
    disabled: useDetailedView.value == "Simple",
    command: (e : any) => {
      useDetailedView.value = "Simple"
    },
  },
  {
    label: 'Detailed view',
    icon: 'pi pi-list',
    disabled: useDetailedView.value == "Detailed",
    command: (e : any) => {
      useDetailedView.value = "Detailed"
    },
  },
  {
    label: 'Text view',
    icon: 'pi pi-align-left',
    disabled: useDetailedView.value == "Text",
    command: (e : any) => {
      useDetailedView.value = "Text"
    },
  }]

  return [
    {
      label: "View",
      items: viewItems
    }]
})

const isDesktop = () => { return width.value > 1440 }

const toggleCalendarOptions = (event: any) => { menu.value.toggle(event) }

defineProps<{ 
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

</script>

<style scoped>
.overview {
  padding: 0 10%;
  margin-bottom: 25vh;
}

@media only screen and (max-width: 1400px) {
  .overview {
    padding: 0 5%;
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
