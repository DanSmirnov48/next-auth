'use client'

import UserButton from '@/components/auth/user-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export const Navbar = () => {
    const pathname = usePathname()
    return (
        <nav className='bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm'>
            <div className='flex gap-x-2'>
                <Button asChild variant={pathname === '/settings' ? 'default' : 'outline'}>
                    <Link href="/settins">
                        Settings
                    </Link>
                </Button>
            </div>
            <UserButton />
        </nav>
    )
}