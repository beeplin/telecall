/* eslint-disable max-classes-per-file */
import type express from 'express'

export interface IdGenerator {
  generate: () => string
}

export class FakeIdGenerator implements IdGenerator {
  private static id = 1000

  generate(): string {
    FakeIdGenerator.id += 1
    return String(FakeIdGenerator.id)
  }
}

export abstract class Session {
  protected _id: string | null = null

  get id(): string | null {
    return this._id
  }

  abstract changeId(): void
}

export class FakeSession extends Session {
  constructor(private readonly idGenerator: IdGenerator = new FakeIdGenerator()) {
    super()
    this.changeId()
  }

  changeId(): void {
    this._id = this.idGenerator.generate()
  }
}

export class ExpressSession extends Session {
  constructor(
    private readonly req: express.Request,
    private readonly res: express.Response,
    private readonly idGenerator: IdGenerator = new FakeIdGenerator(),
  ) {
    super()
    const id = this.req.headers.authorization
    if (id) this._id = id
    else this.changeId()
  }

  changeId(): void {
    this._id = this.idGenerator.generate()
    this.res.setHeader('authorization', this._id)
  }
}
