import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

export const CategoryId = Schema.UUID.pipe(Schema.brand("CategoryId"))
export type CategoryId = typeof CategoryId.Type

export class Category extends Schema.Class<Category>("Category")({
  id: CategoryId,
  name: Schema.NonEmptyTrimmedString,
  description: Schema.NullOr(Schema.String),
  imgSrc: Schema.NullOr(Schema.String),
  isActive: Schema.Boolean,
  createdAt: Schema.Date,
  updatedAt: Schema.NullOr(Schema.Date),
}) {}

export type CategoryT = typeof Category.Type

export class LobbyCategory extends Schema.Class<LobbyCategory>("LobbyCategory")(
  {
    id: CategoryId,
    name: Category.fields.name,
    imgSrc: Category.fields.imgSrc,
    count: Schema.Number,
  }
) {}

export type LobbyCategoryT = typeof LobbyCategory.Type

export class CategoryNotFound extends Schema.TaggedError<CategoryNotFound>()(
  "CategoryNotFoundj",
  {
    id: CategoryId,
  },
  HttpApiSchema.annotations({ status: 404 })
) {}
