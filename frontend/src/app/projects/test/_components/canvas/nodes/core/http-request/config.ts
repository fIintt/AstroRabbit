import { Node } from "@xyflow/react";

import z from "zod";

import { Base } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { withOutputMeta, withConfigMeta } from "@/app/projects/test/_components/canvas/utils";

export const HTTP_BADGE_CONFIG = [
  "Mock",
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "Success",
  "Failure",
  "Delayed",
  "Flaky",
  "Timeout",
  "JSON",
  "Text",
  "Empty",
  "Error",
] as const;

const HTTP_METHOD = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;

const HEADERS = {
  KEY: {
    MAX: 256,
  },
  VALUE: {
    MAX: 8192,
  },
  DEFAULT: {},
} as const;

const BODY = {
  DEFAULT: { message: "Hello World" },
};

const URL = {
  MAX: 2048,
  DEFAULT: "https://httpbingo.org/get",
} as const;

const STATUS_CODE = {
  MIN: 100,
  MAX: 599,
  DEFAULT: 200,
} as const;

const LATENCY = {
  MIN: 0,
  MAX: 10,
  DEFAULT: 0,
} as const;

const FAILURE_RATE = {
  MIN: 0,
  MAX: 100,
  DEFAULT: 0,
} as const;

const commonConfig = z.object({
  headers: withConfigMeta(
    z
      .record(z.string().max(HEADERS.KEY.MAX), z.string().max(HEADERS.VALUE.MAX))
      .default(HEADERS.DEFAULT),
    {
      widget: "RECORD",
    },
  ),
  method: withConfigMeta(z.enum(HTTP_METHOD).default("GET"), {
    widget: "SELECT",
    options: HTTP_METHOD,
  }),
  body: withConfigMeta(z.json().default(BODY.DEFAULT), {
    widget: "JSON",
    hiddenWhen: (config) => ["GET", "DELETE", "HEAD"].includes(String(config.method)),
  }),
});

const mockConfig = z.object({
  provider: withConfigMeta(z.literal("MOCK_API").default("MOCK_API"), {
    widget: "SELECT",
    hiddenOnNode: true,
    options: ["MOCK_API", "CUSTOM_API"],
  }),

  ...commonConfig.shape,

  latency: withConfigMeta(z.number().min(LATENCY.MIN).max(LATENCY.MAX).default(LATENCY.DEFAULT), {
    widget: "NUMBER",
  }),
  statusCode: withConfigMeta(
    z.int().min(STATUS_CODE.MIN).max(STATUS_CODE.MAX).default(STATUS_CODE.DEFAULT),
    { widget: "NUMBER" },
  ),
  failureRate: withConfigMeta(
    z.int().min(FAILURE_RATE.MIN).max(FAILURE_RATE.MAX).default(FAILURE_RATE.DEFAULT),
    { widget: "NUMBER" },
  ),
});

const customConfig = z.object({
  provider: withConfigMeta(z.literal("CUSTOM_API").default("CUSTOM_API"), {
    widget: "SELECT",
    hiddenOnNode: true,
    options: ["MOCK_API", "CUSTOM_API"],
  }),

  ...commonConfig.shape,

  url: withConfigMeta(z.url().max(URL.MAX).default(URL.DEFAULT), {
    widget: "TEXT",
  }),
});

const output = z.object({
  statusCode: withOutputMeta(
    z.int().min(STATUS_CODE.MIN).max(STATUS_CODE.MAX).nullable().default(null),
    {
      widget: "NUMBER",
      group: "status",
    },
  ),
  statusReason: withOutputMeta(z.string().nullable().default(null), {
    widget: "TEXT",
    group: "status",
  }),
  headers: withOutputMeta(
    z
      .record(z.string().max(HEADERS.KEY.MAX), z.string().max(HEADERS.VALUE.MAX))
      .nullable()
      .default(null),
    { widget: "RECORD" },
  ),
  body: withOutputMeta(z.unknown().default(null), { widget: "JSON" }),
});

export type HttpMockData = Base<z.infer<typeof mockConfig>, z.infer<typeof output>>;
export type HttpCustomData = Base<z.infer<typeof customConfig>, z.infer<typeof output>>;
export type HttpRequestData = HttpMockData | HttpCustomData;

export const HTTP_REQUEST_SCHEMAS = {
  MOCK_API: mockConfig,
  CUSTOM_API: customConfig,
  OUTPUT: output,
} as const;

export type HttpRequest = Node<HttpRequestData, "HTTP_REQUEST">;
