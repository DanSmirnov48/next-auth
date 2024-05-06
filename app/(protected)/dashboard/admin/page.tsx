'use client'

import { admin } from "@/actions/admin"
import { RoleGate } from "@/components/auth/role-gate"
import { FormSuccess } from "@/components/form-success"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

export default function DashboardAdmin() {
  const onApiRouteClick = () => {
    fetch("api/admin").then((response) => {
      if (response.ok) {
        toast.success("API route called successfully")
      } else {
        toast.error("Forbidden API route")
      }
    })
  }

  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.success) {
        toast.success(data.success)
      }
      if (data.error) {
        toast.error(data.error)
      }
    })
  }

  return (
    <Shell>
      <Header
        title="Admin"
        description="This is an Admin Page to test admin stuff."
      />
      <div className="grid gap-10">
        <Card className="w-[600px] shadow-md">
          <CardHeader className="text-2xl font-semibold text-center">
            Admin
          </CardHeader>
          <CardContent className="space-y-4">
            <RoleGate allowedRole={UserRole.ADMIN}>
              <FormSuccess message="You are allowed to see this content!" />
            </RoleGate>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <p className="teext-sm font-medium">
                Admin-only API Route
              </p>
              <Button onClick={onApiRouteClick}>
                Click to test
              </Button>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <p className="teext-sm font-medium">
                Admin-only Server Action
              </p>
              <Button onClick={onServerActionClick}>
                Click to test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}