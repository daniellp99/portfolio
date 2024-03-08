export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <div>My Project: {params.slug}</div>;
}
