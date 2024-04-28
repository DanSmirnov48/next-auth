import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface UserInfoProps {
    user?: {
        role: UserRole;
        is2FAEnabled: boolean
    } & DefaultSession["user"];
    label: string;
}

const UserInfo = ({ user, label }: UserInfoProps) => {
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader className="text-2xl font-semibold text-center">
                {label}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">ID</p>
                    <p className="truncate text-sm max-w-[200px] font-mono p-1 bg-slate-100 rounded-md">
                        {user?.id}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">Name</p>
                    <p className="truncate text-sm max-w-[200px] font-mono p-1 bg-slate-100 rounded-md">
                        {user?.name}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">Email</p>
                    <p className="truncate text-sm max-w-[200px] font-mono p-1 bg-slate-100 rounded-md">
                        {user?.email}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">Role</p>
                    <p className="truncate text-sm max-w-[200px] font-mono p-1 bg-slate-100 rounded-md">
                        {user?.role}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">2FA</p>
                    <Badge className="rounded-md" variant={user?.is2FAEnabled ? "success" : "destructive"}>
                        {user?.is2FAEnabled ? "ON" : "OFF"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserInfo;
