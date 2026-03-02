import { onAuthStateChanged } from 'firebase/auth'
import { auth, loadCalendar, saveCalendar } from '@/firebase'
import { useCalendarStore } from '@/stores/Calendar'

export function setupCalendarSync() {
  const calendarStore = useCalendarStore()

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const remote = await loadCalendar(user.uid)
        if (remote) {
          calendarStore.calendarState = remote as any
        }
      } catch (err) {
        console.error('failed to load remote calendar', err)
      }
    }
  })

  calendarStore.$subscribe((mutation, state) => {
    if (auth.currentUser) {
      saveCalendar(auth.currentUser.uid, state.calendarState).catch(e => {
        console.error('failed to save calendar to firestore', e)
      })
    }
  })
}
