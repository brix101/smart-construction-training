import * as Schema from "effect/Schema";
import * as SchemaTransformation from "effect/SchemaTransformation";

/**
 * Domain schemas and inferred types for the application.
 * Each Zod schema is exported in PascalCase, followed by its inferred type with the same name.
 *
 * Schemas must align with corresponding database tables especially code tables for roles and statuses.
 */

const intToBoolean = Schema.Int.pipe(
  Schema.decodeTo(
    Schema.Boolean,
    SchemaTransformation.transform({
      decode: (num) => num !== 0,
      encode: (bool) => (bool ? 1 : 0),
    }),
  ),
);

/**
 * Custom codec for ISO datetime strings. Can't use z.iso() because it expects 'T' separator,
 * but SQLite supports ISO strings without 'T' (e.g., "2023-01-01 12:00:00").
 */
const isoDatetimeToDate = Schema.String.pipe(
  Schema.decodeTo(
    Schema.DateValid,
    SchemaTransformation.transform({
      decode: (str) => new Date(str),
      encode: (date) => date.toISOString(),
    }),
  ),
);

const emailSchema = Schema.String.check(Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));
export const EnvironmentValues = ["production", "development"] as const;
export const Environment = Schema.Literals(EnvironmentValues);
export type Environment = typeof Environment.Type;

export const UserRoleValues = ["user", "manager", "admin"] as const;
export const UserRole = Schema.Literals(UserRoleValues);
export type UserRole = typeof UserRole.Type;

export const MemberRoleValues = ["member", "owner", "admin"] as const;
export const AssignableMemberRoleValues = ["member", "manager", "admin"] as const;
export const MemberRole = Schema.Literals(MemberRoleValues);
export type MemberRole = typeof MemberRole.Type;

export const User = Schema.Struct({
  id: Schema.NonEmptyString.pipe(Schema.brand("UserId")),
  name: Schema.String,
  email: emailSchema,
  emailVerified: intToBoolean,
  image: Schema.NullishOr(Schema.String),
  role: UserRole,
  banned: intToBoolean,
  banReason: Schema.NullishOr(Schema.String),
  banExpires: Schema.NullishOr(isoDatetimeToDate),
  // stripeCustomerId: Schema.NullishOr(Schema.String),
  createdAt: isoDatetimeToDate,
  updatedAt: isoDatetimeToDate,
});
export type User = typeof User.Type;

export const Session = Schema.Struct({
  id: Schema.NonEmptyString.pipe(Schema.brand("SessionId")),
  expiresAt: isoDatetimeToDate,
  token: Schema.NonEmptyString,
  createdAt: isoDatetimeToDate,
  updatedAt: isoDatetimeToDate,
  ipAddress: Schema.NullishOr(Schema.String),
  userAgent: Schema.NullishOr(Schema.String),
  userId: Schema.NonEmptyString.pipe(Schema.brand("UserId")),
  impersonatedBy: Schema.NullishOr(Schema.NonEmptyString.pipe(Schema.brand("UserId"))),
  activeOrganizationId: Schema.NullishOr(
    Schema.NonEmptyString.pipe(Schema.brand("OrganizationId")),
  ),
});
export type Session = typeof Session.Type;
