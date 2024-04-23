'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { CardWrapper } from './card-wrapper'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { newVerification } from '@/actions/new-verification'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'

const NewVerificationForm = () => {

    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState<string | undefined>(undefined)

    const onSubmit = useCallback(() => {
        if (!token) {
            setError("Missing token!")
            return
        }

        newVerification(token).then((data) => {
            setSuccess(data.success)
            setError(data.error)
        }).catch(() => {
            setError("Something went Wrong!")
        })
    }, [token])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <CardWrapper
            headerLaberl="Confirm your email address"
            backButtonLabel="Back to Login"
            backButtonHref="/auth/login"
        >
            <div className='flex items-center w-full justify-center'>
                {!success && !error && <BeatLoader />}
                <FormError message={error} />
                <FormSuccess message={success} />
            </div>

        </CardWrapper>
    )
}

export default NewVerificationForm