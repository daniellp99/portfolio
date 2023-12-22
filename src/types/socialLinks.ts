import { Entry } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

export type SocialLinks = Entry<
  (typeof keystaticConfig)["singletons"]["socialLinks"]
>;
