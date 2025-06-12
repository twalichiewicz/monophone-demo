// Import the click sound
import clickSoundUrl from '../assets/mobileClick.mov'

export class ClickSoundManager {
  private audioContext: AudioContext | null = null
  private audioBuffer: AudioBuffer | null = null
  
  async init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Load the click sound
      console.log('Loading click sound from:', clickSoundUrl)
      const response = await fetch(clickSoundUrl)
      const arrayBuffer = await response.arrayBuffer()
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      
      console.log('Click sound loaded successfully')
    } catch (error) {
      console.error('Failed to load click sound:', error)
    }
  }
  
  playClick() {
    if (!this.audioContext) {
      console.log('No audio context available')
      return
    }
    
    // Resume audio context if suspended (for mobile browsers)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    if (this.audioBuffer) {
      console.log('Playing loaded click sound')
      // Play the loaded sound without any modifications
      const source = this.audioContext.createBufferSource()
      source.buffer = this.audioBuffer
      source.connect(this.audioContext.destination)
      source.start()
    } else {
      console.log('Audio buffer not loaded')
    }
  }
  
}

export const clickSoundManager = new ClickSoundManager()