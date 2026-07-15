<template>
	<div class="month-list">
    <Card>
      <template #content>
      <div class="options">
        <DisplayOptions v-model:sortBy="sortBy" v-model:tagFilter="tagFilter" v-model:checkedFilter="checkedFilter" />
        <!-- <Divider layout="vertical" /> -->
        <div class="checkbox">
          <Checkbox v-model="includeDescriptions"  inputId="include-descriptions" binary />
          <label for="include-descriptions"> Descriptions </label>
        </div>

        <div class="checkbox">
          <Checkbox v-model="includeMonths"  inputId="include-months" binary />
          <label for="include-months"> Months </label>
        </div>
        
        <Button icon="pi pi-clipboard" label="Copy"outlined severity="secondary" @click="copy"></Button>
      </div>
    </template>
   </Card>
    <Textarea fluid id="section_description" readonly autoResize :value="plainTextList" placeholder="Nothing" ></Textarea>
	</div>
</template>

<script setup lang="ts">
import { Textarea } from 'primevue';
import { computed, ref } from 'vue';
import { monthRange } from './MonthList';
import Menubar from 'primevue/menubar';
import DisplayOptions from './DisplayOptions.vue'
import Checkbox from 'primevue/checkbox';
import CheckboxGroup from 'primevue/checkboxgroup';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Divider from 'primevue/divider';

const props = defineProps<{
	sections: Section[];
	month: number;
}>()

const sortBy = ref<string>("Calendar order")
const tagFilter = ref<string[]>([])
const checkedFilter = ref<string>("Any")
const includeDescriptions = ref(true)
const includeMonths = ref(true)

const plainTextList = computed(() => {
  const lines: string[] = [];

  const sections = props.sections.filter((section) => {
    const tasks = section.rows.flatMap(s => s.tasks).filter((task) =>
      task.monthStart <= props.month &&
      task.monthEnd >= props.month &&
      (checkedFilter.value === 'Any' || (checkedFilter.value === 'Checked' && task.checked) || (checkedFilter.value === 'Unchecked' && !task.checked)));

    if (tasks.length === 0) {
      return false;
    }

    if (tagFilter.value.length > 0 && !section.tags.some(t => tagFilter.value.includes(t.name))) {
      return false;
    }

    return true;
  });

  for (const section of sections) {
    const tasks = section.rows.flatMap(s => s.tasks).filter((task) =>
      task.monthStart <= props.month &&
      task.monthEnd >= props.month &&
      (checkedFilter.value === 'Any' || (checkedFilter.value === 'Checked' && task.checked) || (checkedFilter.value === 'Unchecked' && !task.checked)));

    if (tasks.length === 0) {
      continue;
    }

    lines.push(section.name + ':');

    for (const task of tasks) {
      let line = '- ' + task.note;
      if (includeMonths.value) {
        line += ' ' + monthRange(task);
      }

      lines.push(line);

      if (includeDescriptions.value && task.description) {
        lines.push(task.description);
      }
    }

    lines.push('');
  }

  return lines.join('\n').trimEnd();
});

async function copy() {
  try {
    await navigator.clipboard.writeText(plainTextList.value);
  } catch($e) {
    alert('Cannot copy');
  }
}
</script>

<style scoped>
h3 {
  font-family: 'Montserrat', sans-serif;
}

.options {
  display: flex;
  gap: 1em;
  row-gap: 1em;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: center;
}

.checkbox {
  display: flex;
  gap: 0.5em;
  font-weight: 500;
  align-items: center;
}

.header {
  width: 100%;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
}

.edit {
  color: var(--p-gray-400);
  cursor: pointer;
  padding: 0.5em;
}

.month-list {
  display: flex;
  flex-direction: column;
}

</style>
