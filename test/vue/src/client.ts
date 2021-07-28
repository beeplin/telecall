// eslint-disable-next-line import/no-relative-packages
import { TeleClient } from '../../../lib'

export const client = new TeleClient(
  fetch,
  'http://localhost:3300/telecall',
  localStorage,
)
