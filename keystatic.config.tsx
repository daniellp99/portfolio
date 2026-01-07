import {
  CloudConfig,
  LocalConfig,
  collection,
  config,
  fields,
  singleton,
} from "@keystatic/core";
import Image from "next/image";

const isProd = process.env.NODE_ENV === "production";

const localMode: LocalConfig["storage"] = {
  kind: "local",
};

const remoteMode: CloudConfig["storage"] = {
  kind: "cloud",
};

export default config({
  ui: {
    brand: {
      name: "daniellp99's Portfolio",
      mark: () => (
        <Image src="/Avatar.webp" alt="Logo" width={40} height={40} />
      ),
    },
  },
  storage: isProd ? remoteMode : localMode,
  cloud: {
    project: "daniellp-portfolio/portfolio",
  },
  collections: {
    projects: collection({
      label: "Projects",
      slugField: "name",
      path: "src/content/projects/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { length: { min: 1 } } },
        }),
        description: fields.text({ label: "Description", multiline: true }),
        coverImage: fields.image({
          label: "Project Cover Image",
          description: "Displayed in the main grid",
          directory: "public/images/projects",
          publicPath: "images/projects",
          validation: { isRequired: true },
        }),
        bgImage: fields.image({
          label: "Project Background Image",
          description: "Displayed in the main grid as background",
          directory: "public/images/projects",
          publicPath: "images/projects",
          validation: { isRequired: true },
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Active", value: "Active" },
            { label: "Under Development", value: "Development" },
          ],
          defaultValue: "Development",
        }),
        content: fields.mdx({
          label: "Content",
          options: {
            divider: true,
            heading: true,
            bold: true,
            italic: true,
            link: true,
            blockquote: true,
            code: true,
            codeBlock: true,
            orderedList: true,
            unorderedList: true,
          },
        }),
        images: fields.array(
          fields.object({
            alt: fields.text({
              label: "Alt Text",
              validation: { length: { min: 1 } },
            }),
            width: fields.integer({
              label: "Width",
              validation: { isRequired: true },
            }),
            height: fields.integer({
              label: "Height",
              validation: { isRequired: true },
            }),
            src: fields.image({
              label: "Project Image",
              description: "A screenshot of the project",
              directory: "public/images/projects",
              publicPath: "images/projects",
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Images",
            itemLabel: (props) => props.fields.alt.value,
          },
        ),
        links: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            url: fields.url({ label: "URL" }),
          }),
          { label: "Links", itemLabel: (props) => props.fields.name.value },
        ),
      },
    }),
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.mdx({
          label: "Content",
          options: {
            link: true,
            code: true,
            codeBlock: true,
            blockquote: true,
            divider: true,
            heading: true,
            unorderedList: true,
            orderedList: true,
            bold: true,
            italic: true,
          },
        }),
      },
    }),
  },
  singletons: {
    ownerData: singleton({
      label: "Portfolio Owner Data",
      path: "src/content/owner-data",
      schema: {
        name: fields.text({
          label: "Name",
          description: "For the portfolio logo",
        }),
        githubUser: fields.text({
          label: "GitHub",
          description: "The GitHub username (not full URL!)",
        }),
        aboutMe: fields.text({
          multiline: true,
          label: "About Me",
          description: "For display the About Me grid item",
        }),
        avatar: fields.image({
          label: "Avatar",
          description: "Image for the portfolio logo",
          directory: "public/",
          publicPath: "/",
          validation: { isRequired: true },
        }),
        avatarMarker: fields.image({
          label: "Map Marker",
          description: "Image for the map marker",
          directory: "public/",
          publicPath: "/",
          validation: { isRequired: true },
        }),
        avatarMarkerHover: fields.image({
          label: "Map Marker Hover",
          description: "Image for the map marker when hovered",
          directory: "public/",
          publicPath: "/",
          validation: { isRequired: true },
        }),
        avatarMarkerTooltip: fields.text({
          label: "Map Marker Tooltip",
          description: "Tooltip for the map marker",
          validation: { isRequired: true },
        }),
      },
    }),
  },
});
