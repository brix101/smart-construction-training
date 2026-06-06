import * as ConfigProvider from "effect/ConfigProvider";
import * as Context from "effect/Context";
import * as Layer from "effect/Layer";
import * as Logger from "effect/Logger";
import * as References from "effect/References";
import * as Schema from "effect/Schema";

import { CloudflareEnv } from "./CloudflareEnv";
import * as Domain from "./Domain";

export const makeEnvLayer = (env: Env) =>
  Layer.succeedContext(
    Context.make(CloudflareEnv, env).pipe(
      Context.add(ConfigProvider.ConfigProvider, ConfigProvider.fromUnknown(env)),
    ),
  );

export const makeLoggerLayer = (env: Env) => {
  const environment = Schema.decodeUnknownSync(Domain.Environment)(
    env.ENVIRONMENT || "development",
  );
  return Layer.merge(
    Logger.layer(
      environment === "production"
        ? [Logger.consoleJson, Logger.tracerLogger]
        : [Logger.consolePretty(), Logger.tracerLogger],
      { mergeWithExisting: false },
    ),
    Layer.succeed(References.MinimumLogLevel, environment === "production" ? "Info" : "Debug"),
  );
};
