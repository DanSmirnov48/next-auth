'use client'

import UserInfo from '@/components/user-info'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import React from 'react'

const ServerPage = () => {
    const user = useCurrentUser()
    return (
        <UserInfo user={user} label='Client component' />
    )
}

export default ServerPage