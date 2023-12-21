import {
  CloudConfig,
  LocalConfig,
  collection,
  config,
  fields,
  singleton,
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
  singletons: {
    socialLinks: singleton({
      label: "Social Links",
      path: "src/content/social-links",
      schema: {
        github: fields.text({
          label: "GitHub",
          description: "The GitHub username (not full URL!)",
        }),
        X: fields.text({
          label: "X",
          description: "The X handle (not full URL!)",
        }),
        linkedIn: fields.text({
          label: "LinkedIn",
          description: "The LinkedIn ID (not full URL!)",
        }),
      },
    }),
  },
});
