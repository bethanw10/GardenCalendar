import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useCalendarStore = defineStore({
  id: 'calendarPinia',
  state: () => ({
    calendarState: useStorage('calendarStore', [] as Task[])
  }),
  getters: {
    calendar(state): Task[] {
      return state.calendarState;
    },
    calendarJson(state): string {
      return JSON.stringify(state.calendarState);
    }
  },
  actions: {
    import(json: string) {
      this.calendarState = JSON.parse(json)
    },
    test() { 
      console.log("res")
    }
  }
})
