import type * as Schema from "effect/Schema"
import { Atom } from "@effect-atom/atom-react"

export interface TypedSerializable<A, I> {
  readonly [Atom.SerializableTypeId]: {
    readonly key: string
    readonly encode: (value: A) => I
    readonly decode: (value: I) => A
  }
}

export const serializable: {
  <R extends Atom.Atom<any>, I>(options: {
    readonly key: string
    readonly schema: Schema.Schema<Atom.Type<R>, I>
  }): (self: R) => R & TypedSerializable<Atom.Type<R>, I>
  <R extends Atom.Atom<any>, I>(
    self: R,
    options: {
      readonly key: string
      readonly schema: Schema.Schema<Atom.Type<R>, I>
    }
  ): R & TypedSerializable<Atom.Type<R>, I>
} = Atom.serializable as any

export const dehydrate = <A, I>(
  atom: Atom.Atom<A> & TypedSerializable<A, I>,
  value: A
): {
  readonly key: string
  readonly value: {}
  readonly dehydratedAt: number
} => ({
  key: atom[Atom.SerializableTypeId].key,
  value: atom[Atom.SerializableTypeId].encode(value) as {},
  dehydratedAt: Date.now(),
})
