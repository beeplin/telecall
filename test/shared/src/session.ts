/* eslint-disable max-classes-per-file */
import type express from 'express'

export interface Session {
  id: string | null
  start: (id: string) => Promise<void>
  end: () => Promise<void>
}

export class FakeSession implements Session {
  id: string | null = null

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
    this.res.setHeader('authorization', value)
  }

  async start(id: string): Promise<void> {
    this.id = id
  }

  async end(): Promise<void> {
    this.id = ''
  }
}
