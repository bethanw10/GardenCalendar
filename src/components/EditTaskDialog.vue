<template>
	<Dialog v-model:visible="visible" maximizable modal header="Edit Task" class="edit-dialog" >
		<div class="dialog-content">
			<div class="text-fields">
				<IftaLabel>
					<label for="task_name">Name</label>
					<inputText id="task_name" v-model="section.note" placeholder="Task Name" />
				</IftaLabel>
				<IftaLabel>
					<label for="task_description">Notes</label>
					<Textarea id="task_description" autoResize v-model="section.description" placeholder="Notes" rows="3" cols="85" style="resize: none" ></Textarea>
				</IftaLabel>
			</div>

			<Fieldset legend="Color">
				<div class="custom-color">
					<p>Custom</p>
					<div class="custom-inputs">
						<ColorPicker :pt="colorOptions" class="color" v-model="section.color" ></ColorPicker>
						<InputGroup class="color-text">
							<InputGroupAddon>#</InputGroupAddon>
							<InputText autoResize size="medium" v-model="section.color"></InputText>
						</InputGroup>
					</div>
				</div>
				<p>Presets</p>
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
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import ColorPicker from 'primevue/colorpicker';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Fieldset from 'primevue/fieldset';
import IftaLabel from 'primevue/iftalabel';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

defineProps<{ 
	section: any;
}>()

const visible = defineModel<any>('visible', { required: true });
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

function setColor(section: Section, color: string) {
  section.color = color.replace("#", "");
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

<style>

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

.custom-color {
	margin-bottom: 1em;
}

.custom-inputs {
	display: flex;
    align-items: center;
    gap: 1em;
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