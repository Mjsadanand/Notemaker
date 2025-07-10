import AuthForm from '@/components/AuthForm'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function LoginPage() {
  return (
    <div className='mt-20 flex flex-col items-center justify-center'>
      <Card className='w-full max-w-md p-6'>
        <CardHeader className='mb-4'>
            <CardTitle className='text-center text-3xl'>Login</CardTitle>
        </CardHeader>
        <AuthForm type='login' >

        </AuthForm>
      </Card>
    </div>
  )
}

export default LoginPage
