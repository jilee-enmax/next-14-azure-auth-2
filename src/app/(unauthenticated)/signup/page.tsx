import { SignUpForm } from "@/components/sign-up-form";
import { DrawerPanel } from "@/components/DrawerPanel"; // ✅ Import Sign-In Drawer
import { PageWrapper } from "@/app/layout";

export default function SignUpPage() {
  return (
    <PageWrapper description="🚀 UNAUTHENTICATED user but AUTHORIZED endpoint.">
      <main
        aria-label="Sign up page"
        className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white space-y-6"
      >
        {/* 🔹 Global Sign-In Drawer */}
        <DrawerPanel />

        <h1 className="text-2xl font-bold">Create a new account</h1>
        <SignUpForm />
      </main>
    </PageWrapper>
  );
}
