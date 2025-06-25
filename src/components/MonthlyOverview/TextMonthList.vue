<template>
	<div class="month-list">
    <Card>
      <template #content>
      <div class="options">
        <DisplayOptions v-model:sortBy="sortBy" v-model:tagFilter="tagFilter" />
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
const includeDescriptions = ref(true)
const includeMonths = ref(true)

const plainTextList = computed(() => {
  var text = "";

  var sections = props.sections.filter((section) => 
    section.rows.flatMap(s => s.tasks).some((s) => 
      s.monthStart <= props.month && 
      s.monthEnd >= props.month));

  for (var section of sections) {
    text += section.name + ':\n';

    var tasks = section.rows.flatMap(s => s.tasks).filter((s) =>
      s.monthStart <= props.month && 
      s.monthEnd >= props.month);

      for (var task of tasks) {
        text += '- ' + task.note;
        if (includeMonths.value) {
          text += ' ' + monthRange(task)
        }

        // text += '\n'

        if (includeDescriptions.value && task.description) {
          text += '\n' + task.description + '\n'
        }

        text += '\n'
      }
      
      text += '\n'
  }

  return text.trimEnd();
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
