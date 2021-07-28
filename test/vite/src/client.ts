import { TeleClient } from '../../../lib/'

export const client = new TeleClient(
  fetch,
  'http://localhost:3300/telecall',
  localStorage,
)
