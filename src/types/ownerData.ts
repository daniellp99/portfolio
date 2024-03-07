import { Entry } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

export type OwnerData = Entry<
  (typeof keystaticConfig)["singletons"]["ownerData"]
>;
