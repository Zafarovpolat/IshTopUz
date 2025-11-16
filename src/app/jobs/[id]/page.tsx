
import { redirect } from 'next/navigation';

// This page now acts as a permanent redirect to the new project details page structure.
export default function JobRedirectPage({ params }: { params: { id: string } }) {
  redirect(`/marketplace/jobs/${params.id}`);
}
