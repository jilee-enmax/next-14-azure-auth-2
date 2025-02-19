import { SignInForm } from '@/components/sign-in-form';
import { LinksPanel } from '@/components/unauthenticated-links';
import { PageWrapper } from '@/app/layout';
import { DrawerPanel } from "@/components/DrawerPanel";


export default function SignInPage() {
  return (
    <PageWrapper description="Identity must be registered in EntraID + Couchbase (QA) Identity Document. Otherwise, 'create new user' ">
    <section
      aria-label="Sign in page"
      className="flex items-center justify-center min-h-[60vh] bg-gray-900 text-white px-4"
    >
      <div className="flex flex-col items-center space-y-8 w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-center">
          CIAM Roadmap - Outage Portal POC
        </h1>

        {/* Responsive Panel Layout */}
        <div className="flex flex-col md:flex-row items-start space-y-8 md:space-x-16 md:space-y-0 w-full">
          {/* Sign-In Form (Becomes Top on Mobile) */}
          <div className="w-full md:w-1/2 max-w-lg">
            <SignInForm />
          </div>

          {/* Quick Links Panel (Becomes Bottom on Mobile) */}
          <div className="w-full md:w-1/2 max-w-lg">
            <LinksPanel />
          </div>
          <div>
          <DrawerPanel /> {/* 🔥 Add the drawer here */}
          </div>
        </div>
      </div>
    </section>
    </PageWrapper>
  );
}
