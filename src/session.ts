/* eslint-disable max-classes-per-file */
import type { CookieSerializeOptions } from 'cookie'
import cookie from 'cookie'
import type express from 'express'

export interface IdGenerator {
  generate: () => string
}

export class FakeIdGenerator implements IdGenerator {
  private static id = 1000

  static reset(): void {
    FakeIdGenerator.id = 1000
  }

  generate(): string {
    FakeIdGenerator.id += 1
    return String(FakeIdGenerator.id)
  }
}

export interface Session {
  id: string | null
  changeId: () => void
}

abstract class BaseSession implements Session {
  protected _id: string | null = null

  get id(): string | null {
    return this._id
  }

  abstract changeId(): void
}

export class FakeSession extends BaseSession {
  constructor(private readonly idGenerator: IdGenerator = new FakeIdGenerator()) {
    super()
    this.changeId()
  }

  changeId(): void {
    this._id = this.idGenerator.generate()
  }
}

export class ExpressHeaderSession extends BaseSession {
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

export class ExpressCookieSession extends BaseSession {
  // eslint-disable-next-line max-params
  constructor(
    private readonly req: express.Request,
    private readonly res: express.Response,
    private readonly cookieName: string,
    private readonly cookieOptions: CookieSerializeOptions = { httpOnly: true },
    private readonly idGenerator: IdGenerator = new FakeIdGenerator(),
  ) {
    super()
    const id = cookie.parse(this.req.headers.cookie ?? '')[this.cookieName]
    if (id) this._id = id
    else this.changeId()
  }

  changeId(): void {
    this._id = this.idGenerator.generate()
    this.res.setHeader(
      'Set-Cookie',
      cookie.serialize(this.cookieName, this._id, this.cookieOptions),
    )
  }
}
