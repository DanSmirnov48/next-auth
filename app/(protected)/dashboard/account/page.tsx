import UserForm from "@/components/auth/user-form";
import { Header } from "@/components/header";
import { Shell } from "@/components/shell";

export default function DashboardSettings() {
  return (
    <Shell>
      <Header
        title="Account"
        description="Manage account and website settings."
        size="default"
      />
      <div className="grid gap-10">
        <UserForm />
      </div>
    </Shell>
  );
}
