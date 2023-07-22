export default function ManageProjectPage({ params }: { params: { slug: string } }) {
  return <div>My Post {params.slug}</div>;
}
