// Import the click sound
import clickSoundMp3 from '../assets/mobileClick.mp3'

export class ClickSoundManager {
  private audio: HTMLAudioElement | null = null
  private isInitialized = false
  
  init() {
    if (this.isInitialized) return
    
    try {
      // Use HTML Audio element instead of Web Audio API
      this.audio = new Audio(clickSoundMp3)
      this.audio.volume = 0.5
      this.audio.preload = 'auto'
      
      // Pre-load the audio
      this.audio.load()
      
      this.isInitialized = true
      console.log('Click sound initialized')
    } catch (error) {
      console.error('Failed to initialize click sound:', error)
    }
  }
  
  playClick() {
    if (!this.audio) {
      this.init()
    }
    
    if (this.audio) {
      try {
        // Clone the audio to allow overlapping sounds
        const audioClone = this.audio.cloneNode() as HTMLAudioElement
        audioClone.volume = 0.5
        audioClone.play().catch(err => {
          console.warn('Failed to play click sound:', err)
        })
      } catch (error) {
        console.error('Error playing click sound:', error)
      }
    }
  }
}

export const clickSoundManager = new ClickSoundManager()