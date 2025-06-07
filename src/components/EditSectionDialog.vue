<template>
	<Dialog v-model:visible="visible" maximizable modal header="Edit Section" class="edit-dialog" >
		<div class="dialog-content">
			<div class="text-fields">
				<IftaLabel >
					<label for="section_name">Name</label>
					<inputText id="section_name" fluid v-model="section.name" placeholder="Section Name" />
				</IftaLabel>
				<Fieldset legend="Tags" >
					<div class="tags-section">

						<InputGroup>
							<inputText id="section_name" v-model="newTagText" placeholder="New tag"/>
							<InputGroupAddon>
								<Button label="Add" @click="addTag(section)"></Button>
							</InputGroupAddon>
						</InputGroup>

						<MultiSelect v-model="tagNames" @change="updateTags" :options="allTags" filter placeholder="Add existing tag"/>

						<!-- <div v-if="section.tags.length > 0" class="tag-list">
							<template v-for="tag in section.tags">
								<Chip class="tag" :label="tag.name" @remove="removeTag(section, tag)" removable></Chip>
							</template>
						</div> -->
					</div>
				</Fieldset>				
			</div>			
			<Button type="submit" label="Done" @click="visible = false"></Button>
		</div>
	</Dialog>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import IftaLabel from 'primevue/iftalabel';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Fieldset from 'primevue/fieldset';
import Button from 'primevue/button';
import { MultiSelect } from 'primevue';
import { computed, ref } from 'vue';
import { useCalendarStore } from '@/stores/Calendar';

const props = defineProps<{ 
	section: Section;
}>()

const store = useCalendarStore()
const newTagText = ref("")
const visible = defineModel<boolean>('visible', { required: true })

const allTags = computed(() => {
    return store.distinctTagNames;
});

const tagNames = computed(() =>  {
    return props.section.tags.map(t => t.name)
})

function updateTags(event: any) {
    props.section.tags.splice(0, props.section.tags.length)
    event.value.forEach((value: string) => {
        props.section.tags.push({name: value})
    });
}

function addTag(section: Section) {
    section.tags.push({name: newTagText.value})
	newTagText.value = "";
}

function removeTag(section:Section, tag:Tag) {
    const index = section.tags.indexOf(tag);
    section.tags.splice(index, 1);
}
</script>

<style>
.tags-section {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.tag {
    font-size: 14px;
    margin-right: 0.5em;
}
</style>