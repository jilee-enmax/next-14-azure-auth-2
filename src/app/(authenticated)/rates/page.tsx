'use server';

import { auth } from '@/auth';
import { ProductFeatures } from '@/components/ProductFeatures';
import { PageWrapper } from '@/app/layout';

export default async function RatesPage() {
  const session = await auth();
  const userName = session?.user?.name || 'Unknown user';
  const userEmail = session?.user?.email || 'Email not available';

  return (
    <PageWrapper description="🚀 Calling an UNAUTHENTICATED & UNAUTHORIZED endpoint.">
    <main>
      <br></br>
      <section>
        <br></br>
        <ProductFeatures />
      </section>
    </main>
    </PageWrapper>
  );
}
