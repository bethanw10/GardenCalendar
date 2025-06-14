import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useCalendarStore = defineStore({
  id: 'calendarPinia',
  state: () => ({
    calendarState: useStorage('calendarStore', [] as Section[])
  }),
  getters: {
    calendar(state): Section[] {
      return state.calendarState;
    },
    calendarJson(state): string {
      return JSON.stringify(state.calendarState);
    },
    distinctTagNames(state): string[] {
      var tags = state.calendarState.flatMap(c => c.tags).map(t => t.name);
      return [...new Set(tags)];
    },
  },
  actions: {
    import(json: string) {
      this.calendarState = JSON.parse(json)
    }
  }
})
