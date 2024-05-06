'use client'

import { Header } from '@/components/header'
import { Shell } from '@/components/shell'
import UserInfo from '@/components/user-info'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import React from 'react'

export default function DashboardClient() {
    const user = useCurrentUser()
    return (
        <Shell>
            <Header
                title="Client"
                description="This is a Client User Info Component."
            />
            <div className="grid gap-10">
                <UserInfo user={user} label='Client component' />
            </div>
        </Shell>
    );
}
