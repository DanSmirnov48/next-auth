import { TriangleAlert } from 'lucide-react'
import { CardWrapper } from './card-wrapper'

export const ErrorCard = () => {
    return (
        <CardWrapper
            headerLaberl="Oops! Something went Wrong!"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div className='w-full flex justify-center items-center'>
                <TriangleAlert className='text-red-400'/>
            </div>
        </CardWrapper>
    )
}