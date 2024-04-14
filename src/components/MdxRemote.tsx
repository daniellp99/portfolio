import { MDXComponents } from "mdx/types";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import Link from "next/link";
import React from "react";
import { highlight } from "sugar-high";

type HeadingProps = {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children?: React.ReactNode;
  className?: string;
};

const Heading: React.FC<HeadingProps> = ({ level, children, className }) => {
  const slug = slugify(children?.toString()!);
  return React.createElement(
    level,
    { id: slug, className },
    [
      React.createElement("a", {
        href: `#${slug}`,
        key: `link-${slug}`,
        className: "anchor",
      }),
    ],
    children,
  );
};

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

let components: MDXComponents = {
  h1: (props) => <Heading level="h1" {...props} />,
  h2: (props) => <Heading level="h2" {...props} />,
  h3: (props) => <Heading level="h3" {...props} />,
  h4: (props) => <Heading level="h4" {...props} />,
  h5: (props) => <Heading level="h5" {...props} />,
  h6: (props) => <Heading level="h6" {...props} />,
  a: ({ className, ...props }) => {
    let href = props.href;

    if (href?.startsWith("/")) {
      let url = new URL(href);
      return <Link href={url}>{props.children}</Link>;
    }

    if (href?.startsWith("#")) {
      return <a {...props} />;
    }

    return <a target="_blank" rel="noopener noreferrer" {...props} />;
  },
  code: ({ children, className, ...props }) => {
    let codeHTML = highlight(children?.toString()!);
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
};

export function CustomMDX(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
