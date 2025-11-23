import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { knowledgeAPI, nlpAPI } from '../services/api'

const SystemContext = createContext()

const initialState = {
  knowledgeHealth: null,
  nlpHealth: null,
  knowledgeItems: [],
  nlpPosts: [],
  analytics: null,
  loading: false,
  error: null
}

function systemReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_KNOWLEDGE_HEALTH':
      return { ...state, knowledgeHealth: action.payload }
    case 'SET_NLP_HEALTH':
      return { ...state, nlpHealth: action.payload }
    case 'SET_KNOWLEDGE_ITEMS':
      return { ...state, knowledgeItems: action.payload }
    case 'SET_NLP_POSTS':
      return { ...state, nlpPosts: action.payload }
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload }
    default:
      return state
  }
}

export function SystemProvider({ children }) {
  const [state, dispatch] = useReducer(systemReducer, initialState)

  const checkSystemHealth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const [knowledgeHealth, nlpHealth] = await Promise.all([
        knowledgeAPI.getHealth(),
        nlpAPI.getHealth()
      ])

      dispatch({ type: 'SET_KNOWLEDGE_HEALTH', payload: knowledgeHealth })
      dispatch({ type: 'SET_NLP_HEALTH', payload: nlpHealth })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const loadKnowledgeItems = async (page = 1, limit = 10) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await knowledgeAPI.getItems(page, limit)
      dispatch({ type: 'SET_KNOWLEDGE_ITEMS', payload: response })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const loadNLPPosts = async (page = 1, limit = 20) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await nlpAPI.getPosts(page, limit)
      dispatch({ type: 'SET_NLP_POSTS', payload: response })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const loadAnalytics = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await knowledgeAPI.getAnalytics()
      dispatch({ type: 'SET_ANALYTICS', payload: response })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addKnowledgeItem = async (itemData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await knowledgeAPI.addItem(itemData)
      // Reload items after adding
      await loadKnowledgeItems()
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const generateNLPSamples = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await nlpAPI.generateSamples()
      // Reload posts after generation
      await loadNLPPosts()
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }

  useEffect(() => {
    checkSystemHealth()
  }, [])

  const value = {
    ...state,
    checkSystemHealth,
    loadKnowledgeItems,
    loadNLPPosts,
    loadAnalytics,
    addKnowledgeItem,
    generateNLPSamples,
    clearError
  }

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  )
}

export const useSystem = () => {
  const context = useContext(SystemContext)
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider')
  }
  return context
}
