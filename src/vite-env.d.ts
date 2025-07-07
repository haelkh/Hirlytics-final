/// <reference types="vite/client" />

interface Window {
  AOS: {
    init: (config: {
      duration?: number
      once?: boolean
      easing?: string
      initClassName?: string
      animatedClassName?: string
    }) => void
    refresh: () => void
  }
}
