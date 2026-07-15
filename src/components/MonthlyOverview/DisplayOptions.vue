<template>
	<div class="filters">
		<FloatLabel variant="in">
			<Select id="sort" v-model="sortBy" :options="sortOptions"> </Select>
			<label for="sort">Sort by</label>
		</FloatLabel>

		<FloatLabel variant="in">
			<MultiSelect id="filter" v-model="tagFilter" :options="allTags" filter />
			<label for="filter">Tags</label>
		</FloatLabel>

		<FloatLabel variant="in">
			<Select id="filter" v-model="checkedFilter" :options="checkedOptions"> </Select>
			<label for="filter">Checked</label>
		</FloatLabel>
	</div>
</template>

<script setup lang="ts">
import { useCalendarStore } from '@/stores/Calendar';
import { MultiSelect, Select } from 'primevue';
import FloatLabel from 'primevue/floatlabel';
import { computed } from 'vue';

const store = useCalendarStore()
const sortOptions = ["Calendar order", "Alphabetically"]
const checkedOptions = ["Any", "Checked", "Unchecked"]

const tagFilter = defineModel<string[]>('tagFilter', { default: [], required: false })
const sortBy = defineModel<string>('sortBy', { default: "Calendar order", required: false })
const checkedFilter = defineModel<string>('checkedFilter', { default: "Any", required: false })
const allTags = computed(() => {
  return store.distinctTagNames;
});

</script>

<style scoped>
.filters {
	display: flex;
	flex-wrap: wrap;
	gap: 1em;
	justify-content: center;
}

</style>