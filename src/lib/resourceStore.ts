"use client"

import { useState, useEffect } from 'react'

// 1. Data Structure
export interface ResourceState {
  totalPoints: number
  currentPoints: number
  hasPendingPackage: boolean
}

const STORAGE_KEY = 'ai_platform_resource_store'

// Default State
const DEFAULT_STATE: ResourceState = {
  totalPoints: 1000,
  currentPoints: 1000,
  hasPendingPackage: false,
}

// In-memory state
let state: ResourceState = { ...DEFAULT_STATE }
const subscribers = new Set<() => void>()

// 2. Persistence Helpers
const saveState = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

const loadState = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        state = { ...DEFAULT_STATE, ...JSON.parse(stored) }
      } catch (e) {
        console.error('Failed to parse resource store', e)
        state = { ...DEFAULT_STATE }
      }
    }
  }
}

// Notify all subscribers
const notify = () => {
  subscribers.forEach(callback => callback())
  saveState()
}

// Initialize logic (lazy load)
let isInitialized = false
const initStore = () => {
  if (!isInitialized) {
    loadState()
    isInitialized = true
  }
}

// 3. Core Logic
export const resourceStore = {
  get state() {
    initStore()
    return { ...state }
  },

  // Reset / Set points (Helper)
  setPoints: (current: number, total?: number) => {
    initStore()
    state.currentPoints = current
    if (total !== undefined) state.totalPoints = total
    notify()
  },

  // The requested function
  consumePoints: (amount: number) => {
    initStore()
    
    // Validate
    if (state.currentPoints < amount) {
      console.warn('Not enough points')
      return { success: false, triggered: false }
    }

    const prevRatio = (state.totalPoints - state.currentPoints) / state.totalPoints
    
    // Consume
    state.currentPoints -= amount
    
    const newRatio = (state.totalPoints - state.currentPoints) / state.totalPoints

    // Threshold Check: 30%, 60%, 90%
    const thresholds = [0.3, 0.6, 0.9]
    
    // Check if we crossed any threshold that we hadn't crossed before
    let packageTriggered = false
    
    for (const t of thresholds) {
      if (prevRatio < t && newRatio >= t) {
        // 50% probability
        if (Math.random() > 0.5) {
          state.hasPendingPackage = true
          packageTriggered = true
          console.log(`ResourceStore: Threshold ${t * 100}% reached. Package pending: true`)
        } else {
          console.log(`ResourceStore: Threshold ${t * 100}% reached. Package missed (luck).`)
        }
      }
    }

    notify()
    return { success: true, triggered: packageTriggered }
  },

  // Claim package logic (optional, but needed to reset flag)
  claimPackage: () => {
    initStore()
    if (state.hasPendingPackage) {
      state.hasPendingPackage = false
      // Maybe give some reward here? For now just reset flag.
      notify()
      return true
    }
    return false
  },
  
  // Subscribe mechanism
  subscribe: (callback: () => void) => {
    subscribers.add(callback)
    return () => { subscribers.delete(callback) }
  }
}

// 4. React Hook
export const useResourceStore = () => {
  // Initialize state from store
  const [snap, setSnap] = useState<ResourceState>(resourceStore.state)

  useEffect(() => {
    // Subscribe to changes
    const unsubscribe = resourceStore.subscribe(() => {
      setSnap(resourceStore.state)
    })
    return unsubscribe
  }, [])

  return {
    ...snap,
    setPoints: resourceStore.setPoints,
    consumePoints: resourceStore.consumePoints,
    claimPackage: resourceStore.claimPackage
  }
}
