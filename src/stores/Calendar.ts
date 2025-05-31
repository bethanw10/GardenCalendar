import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useCalendarStore = defineStore({
  id: 'calendarStore',
  state: () => ({
    calendarState: useStorage('calendarStore', [] as Task[])
  }),
  getters: {
    calendar(): Task[] {
      return this.calendarState;
    },
  }
})
