import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from 'naive-ui'
import { useWarningStore } from '@/stores/warning'
import { warningColors, warningIcons } from '@/mock/weather'
import type { WarningData } from '@/mock/weather'

let initialized = false
let previousWarningIds = new Set<string>()
let audioContext: AudioContext | null = null

export function useAlertChain() {
  const router = useRouter()
  const warningStore = useWarningStore()
  const notification = useNotification()

  if (!initialized) {
    previousWarningIds = new Set(warningStore.warnings.map(w => w.id))
    initialized = true
  }

  function playAlertSound() {
    if (!warningStore.soundEnabled) return

    try {
      if (!audioContext) {
        audioContext = new AudioContext()
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }

      const playTone = (freq: number, startTime: number, duration: number) => {
        const oscillator = audioContext!.createOscillator()
        const gainNode = audioContext!.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext!.destination)

        oscillator.frequency.value = freq
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01)
        gainNode.gain.setValueAtTime(0.3, startTime + duration - 0.05)
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      }

      const now = audioContext.currentTime

      for (let i = 0; i < 3; i++) {
        const offset = i * 0.7
        playTone(880, now + offset, 0.2)
        playTone(660, now + offset + 0.25, 0.2)
      }
    } catch {
      // AudioContext not supported or blocked
    }
  }

  function sendBrowserNotification(warning: WarningData) {
    if (!('Notification' in window)) return

    if (Notification.permission === 'granted') {
      new Notification(warning.title, {
        body: warning.content,
        tag: warning.id
      })
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(warning.title, {
            body: warning.content,
            tag: warning.id
          })
        }
      })
    }
  }

  function showWarningToast(warning: WarningData) {
    const isOrange = warning.level === 'orange'
    notification[isOrange ? 'warning' : 'info']({
      title: `${warningIcons[warning.type]} ${warning.title}`,
      content: `${warning.region} - ${warning.content}`,
      duration: 8000
    })
  }

  function processWarnings(newWarnings: WarningData[]) {
    const newIds = new Set(newWarnings.map(w => w.id))
    const added = newWarnings.filter(w => !previousWarningIds.has(w.id))

    for (const warning of added) {
      if (warning.level === 'red' || warning.level === 'orange') {
        warningStore.activeAlert = { warning, dismissable: true }
        warningStore.highlightedWarningId = warning.id
        playAlertSound()
        sendBrowserNotification(warning)

        if (router.currentRoute.value.path !== '/warning') {
          router.push('/warning')
        }
      } else {
        showWarningToast(warning)
      }
    }

    previousWarningIds = newIds
  }

  watch(
    () => warningStore.warnings,
    (newWarnings) => {
      processWarnings(newWarnings)
    }
  )

  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  return {
    playAlertSound,
    requestNotificationPermission
  }
}
