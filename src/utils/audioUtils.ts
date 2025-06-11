// Import the click sound
import clickSoundUrl from '../assets/mobileClick.mov'

export class ClickSoundManager {
  private audioContext: AudioContext | null = null
  private audioBuffer: AudioBuffer | null = null
  private variations: AudioBuffer[] = []
  
  async init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Load the original sound
      const response = await fetch(clickSoundUrl)
      const arrayBuffer = await response.arrayBuffer()
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      
      // Create variations
      this.createVariations()
    } catch (error) {
      console.error('Failed to load click sound:', error)
      // Fallback to generated sounds
      this.createGeneratedSounds()
    }
  }
  
  private createVariations() {
    if (!this.audioBuffer || !this.audioContext) return
    
    // We'll create 5 variations with different pitch/tone modulations
    for (let i = 0; i < 5; i++) {
      // For now, we'll use the original buffer
      // In a real implementation, we'd apply different audio processing
      this.variations.push(this.audioBuffer)
    }
  }
  
  private createGeneratedSounds() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    // We'll use generated sounds as fallback
    // These will be created on-the-fly when played
  }
  
  playClick() {
    if (!this.audioContext) return
    
    // Randomly select a variation
    const variation = Math.floor(Math.random() * 5)
    
    if (this.audioBuffer && this.variations.length > 0) {
      // Play the loaded sound
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = this.variations[variation]
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      // Apply slight pitch variation
      source.playbackRate.value = 0.9 + (Math.random() * 0.2)
      gainNode.gain.value = 0.3 + (Math.random() * 0.2)
      
      source.start()
    } else {
      // Fallback to generated sound
      this.playGeneratedClick(variation)
    }
  }
  
  private playGeneratedClick(variation: number) {
    if (!this.audioContext) return
    
    const frequencies = [60, 65, 55, 70, 62]
    const durations = [0.08, 0.1, 0.07, 0.09, 0.085]
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    // Deep satisfying click
    oscillator.frequency.value = frequencies[variation]
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + durations[variation])
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + durations[variation])
    
    // Add a secondary click for richness
    const oscillator2 = this.audioContext.createOscillator()
    const gainNode2 = this.audioContext.createGain()
    
    oscillator2.connect(gainNode2)
    gainNode2.connect(this.audioContext.destination)
    
    oscillator2.frequency.value = frequencies[variation] * 2
    oscillator2.type = 'square'
    
    gainNode2.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.02)
    
    oscillator2.start(this.audioContext.currentTime)
    oscillator2.stop(this.audioContext.currentTime + 0.02)
  }
}

export const clickSoundManager = new ClickSoundManager()