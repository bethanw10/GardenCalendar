<template>
	<div class="task" :style="blockStyle(section)">
		<div class="month-span-controls">
      <div class="add" :class="isPrevMonthOpen(row.sections, section.monthStart) ? 'clickable' : ''">
        <div v-if="isPrevMonthOpen(row.sections, section.monthStart)" @click="addPrevMonth(row, section)"><i class="pi pi-angle-left"></i> </div>
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
        
        <Dialog v-model:visible="visible" maximizable modal header="Edit Task" class="edit-dialog" >
          <div class="dialog-content">
        
            <Fieldset legend="Text">
              <div class="text-fields">
                <inputText id="task_name" v-model="section.note" placeholder="Task Name" />
                <Textarea autoResize @update:modelValue="console.log" id="over_label" v-model="section.description" placeholder="Notes" rows="5" cols="30" style="resize: none" ></Textarea>
              </div>
            </Fieldset>

            <Fieldset legend="Color">
              <template #legend>
              <div class="flex items-center">
                  <span class="font-bold mb-2">Color</span>
              </div>
              </template>
              <p>Custom:</p>
              <ColorPicker :pt="colorOptions" class="color" v-model="section.color" ></ColorPicker> 
              #<InputText class="color-text" size="small" v-model="section.color"></InputText>
              <p>Presets:</p>
              <div class="colors">
                <div class="color-grid">
                  <template v-for="presetColor in presetColors" :key="color" class="color" >
                    <div class="color-square" :style="{backgroundColor: presetColor}" @click="setColor(section, presetColor)"></div>
                  </template>
                </div>
              </div>
            </Fieldset>
            <Button type="submit" label="Done" @click="visible = false"></Button>

          </div>
        </Dialog>
        
      </div>
    </div>
		<div class="month-span-controls">
      <div class="add" :class="isNextMonthOpen(row.sections, section.monthEnd) ? 'clickable' : ''">
        <div v-if="isNextMonthOpen(row.sections, section.monthEnd)" @click="addNextMonth(row, section)"><i class="pi pi-angle-right"></i></div>
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
import ColorPicker from 'primevue/colorpicker';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Dialog from 'primevue/dialog';
import Fieldset from 'primevue/fieldset';

defineProps<{ 
	row: Row;
	section: Section;
}>()

const visible = ref(false);
const presetColors : Ref<string[]> = ref([  
  "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d",
  "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b",
  "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c",
  "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207",
  "#bef264", "#a3e635", "#84cc16", "#65a30d", "#4d7c0f", "#3f6212",
  "#a7f3d0", "#34d399", "#10b981", "#059669", "#047857", "#065f46",
  "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a",
  "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1",
  "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8",
  "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3",
  "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#581c87",
  "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b",
  "#D2D0A0", "#9EBC8A", "#73946B", "#537D5D", "#426b4c", "#2e4f36",
  "#cad2c5", "#b2bdac", "#84a98c", "#52796f", "#354f52", "#2f3e46",
  "#e6ccb2", "#ddb892", "#b08968", "#9c7a5c", "#7f5539", "#63422d",
  "#e76f51", "#f4a261", "#e9c46a", "#8ab17d", "#2a9d8f", "#264653"
]);

function blockStyle(section: any) {
  const offset = 2;

  return reactive({
    'grid-column': `${section.monthStart + offset}/${section.monthEnd + offset + 1}`,
    'background': "#" + section.color
  })
}

function addPrevMonth(task: Task, section: Section) {
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

function addNextMonth(task: Task, section: Section) {
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

function setColor(section: Section, color: string) {
  section.color = color.replace("#", "");
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

const colorOptions = {
  input: () => ({
    style: {
      "border": "2px white outset",
      "display": "inline",
    }
  })
};
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

.edit-dialog {
  /* width: 50rem; */
  flex-direction: column;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.text-fields {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.colors {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.color-grid {
  display: inline-grid;
  grid-template-columns: repeat(24, auto);
}

.color-text {
  width: 6rem;
  /* border: 2px white solid; */
}

.color-square {
  width: 26px;
  height: 26px;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
}
</style>
