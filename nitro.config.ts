import type { NitroConfig } from "nitro/types";

export default {
  noExternals: ["tslib"],
  traceDeps: ["!tslib"],
} satisfies NitroConfig;