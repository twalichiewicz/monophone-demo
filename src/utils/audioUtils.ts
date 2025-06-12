// Import the click sounds in multiple formats for compatibility
import clickSoundMp3 from '../assets/mobileClick.mp3'
import clickSoundOgg from '../assets/mobileClick.ogg'
import clickSoundMov from '../assets/mobileClick.mov'

export class ClickSoundManager {
  private audioContext: AudioContext | null = null
  private audioBuffer: AudioBuffer | null = null
  
  async init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Try loading different formats
      const formats = [
        { url: clickSoundMp3, type: 'MP3' },
        { url: clickSoundOgg, type: 'OGG' },
        { url: clickSoundMov, type: 'MOV' }
      ]
      
      for (const format of formats) {
        try {
          console.log(`Trying to load click sound as ${format.type}:`, format.url)
          const response = await fetch(format.url)
          const arrayBuffer = await response.arrayBuffer()
          this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
          console.log(`Click sound loaded successfully as ${format.type}`)
          break
        } catch (error) {
          console.warn(`Failed to load ${format.type} format:`, error)
        }
      }
      
      if (!this.audioBuffer) {
        console.error('Failed to load click sound in any format')
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
    }
  }
  
  async playClick() {
    if (!this.audioContext) {
      console.log('No audio context available, attempting to initialize...')
      await this.init()
    }
    
    if (!this.audioContext) {
      return
    }
    
    // Resume audio context if suspended (for mobile browsers)
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume()
        console.log('Audio context resumed')
      } catch (error) {
        console.error('Failed to resume audio context:', error)
        return
      }
    }
    
    if (this.audioBuffer) {
      try {
        const source = this.audioContext.createBufferSource()
        source.buffer = this.audioBuffer
        
        // Add a gain node for volume control
        const gainNode = this.audioContext.createGain()
        gainNode.gain.value = 0.5 // 50% volume
        
        source.connect(gainNode)
        gainNode.connect(this.audioContext.destination)
        source.start()
      } catch (error) {
        console.error('Error playing click sound:', error)
      }
    } else {
      console.log('Audio buffer not loaded, attempting to initialize...')
      await this.init()
    }
  }
  
}

export const clickSoundManager = new ClickSoundManager()