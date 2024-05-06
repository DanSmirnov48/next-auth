import { Header } from '@/components/header';
import { Shell } from '@/components/shell';
import UserInfo from '@/components/user-info'
import { currentUser } from '@/lib/auth'
import React from 'react'

export default async function DashboardServer() {
    const user = await currentUser()
    return (
        <Shell>
            <Header
                title="Server"
                description="This is a Server User Info Component."
            />
            <div className="grid gap-10">
                <UserInfo user={user} label='Server component' />
            </div>
        </Shell>
    );
}
