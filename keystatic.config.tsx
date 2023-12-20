import {
  CloudConfig,
  LocalConfig,
  collection,
  config,
  fields,
} from "@keystatic/core";

const isProd = process.env.NODE_ENV === "production";

const localMode: LocalConfig["storage"] = {
  kind: "local",
};

const remoteMode: CloudConfig["storage"] = {
  kind: "cloud",
};

export default config({
  storage: isProd ? remoteMode : localMode,
  cloud: {
    project: "daniellp-portfolio/portfolio",
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
});
