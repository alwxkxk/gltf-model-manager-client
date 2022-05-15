// src/mocks/browser.js
import { setupWorker } from 'msw'
// import { handlers } from './handlers'
import { modelInfo } from './modelInfo'
// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...modelInfo)