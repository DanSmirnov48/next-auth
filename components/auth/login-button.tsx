'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { LoginForm } from './login-form';

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: 'model' | 'redirect';
    asChild?: boolean
}

const LoginButton = ({ children, mode = 'redirect', asChild }: LoginButtonProps) => {

    const router = useRouter()

    const onClick = () => {
        router.push('/auth/login')
    }

    if (mode === 'model') {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className='p-0 w-auto bg-transparent border-none'>
                    <LoginForm />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <span onClick={onClick} className='cursor-pointer'>
            {children}
        </span>
    )
}

export default LoginButton