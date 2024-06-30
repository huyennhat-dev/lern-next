import LoginForm from '@/app/(auth)/login/login-form'
import React from 'react'

type Props = {}

const LoginPage = (props: Props) => {
    return (
        <div className="max-w-96 p-5">
            <LoginForm />
        </div>
    )
}

export default LoginPage