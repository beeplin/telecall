/* eslint-disable max-classes-per-file */
import type express from 'express'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { ContextStore } from '../../../dist/context'

export interface Session {
  id: string | null
  start: (id: string) => Promise<void>
  end: () => Promise<void>
}

export class TestSession implements Session {
  private _id: string | null = null

  private readonly file = path.join(__dirname, '.session-id')

  get id(): string {
    if (this._id == null) this._id = readFileSync(this.file).toString()
    return this._id
  }

  set id(value: string) {
    this._id = value
    writeFileSync(this.file, value)
  }

  async start(id: string): Promise<void> {
    this.id = id
  }

  async end(): Promise<void> {
    this.id = ''
  }
}

export class ExpressSession implements Session {
  private _id: string | null = null

  constructor(
    private readonly req: express.Request,
    private readonly res: express.Response,
  ) {}

  get id(): string {
    if (this._id == null) this._id = this.req.headers.authorization ?? ''
    return this._id
  }

  set id(value: string) {
    this._id = value
    this.res.setHeader('access-control-expose-headers', 'authorization')
    this.res.setHeader('authorization', value)
  }

  async start(id: string): Promise<void> {
    this.id = id
  }

  async end(): Promise<void> {
    this.id = ''
  }
}

const context = new ContextStore<{ server: string; session: Session }>()

export default context
