// Import the click sound
import clickSoundMp3 from '../assets/mobileClick.mp3'

export class ClickSoundManager {
  private audioPool: HTMLAudioElement[] = []
  private poolSize = 5
  private currentIndex = 0
  private isInitialized = false
  
  init() {
    if (this.isInitialized) return
    
    try {
      // Create a pool of audio elements for instant playback
      for (let i = 0; i < this.poolSize; i++) {
        const audio = new Audio(clickSoundMp3)
        audio.volume = 0.5
        audio.preload = 'auto'
        
        // Force load the audio
        audio.load()
        
        // Pre-play and pause to fully cache the audio
        audio.play().then(() => {
          audio.pause()
          audio.currentTime = 0
        }).catch(() => {
          // Ignore autoplay errors during init
        })
        
        this.audioPool.push(audio)
      }
      
      this.isInitialized = true
      console.log('Click sound pool initialized with', this.poolSize, 'instances')
    } catch (error) {
      console.error('Failed to initialize click sound:', error)
    }
  }
  
  playClick() {
    if (!this.isInitialized || this.audioPool.length === 0) {
      this.init()
      return
    }
    
    try {
      // Get the next audio element from the pool
      const audio = this.audioPool[this.currentIndex]
      
      // Reset and play immediately
      audio.currentTime = 0
      const playPromise = audio.play()
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Failed to play click sound:', err)
        })
      }
      
      // Move to next audio element in pool
      this.currentIndex = (this.currentIndex + 1) % this.poolSize
    } catch (error) {
      console.error('Error playing click sound:', error)
    }
  }
}

export const clickSoundManager = new ClickSoundManager()