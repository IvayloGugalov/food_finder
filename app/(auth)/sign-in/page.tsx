import AuthForm from '@/components/auth/Form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const Page = async () => {
  return (
    <main className='max-w-lg mx-auto my-4 bg-popover p-10'>
      <h1 className='text-2xl font-bold text-center'>Sign in to your account</h1>
      <AuthForm action='/api/sign-in'>
        <Label htmlFor='username' className='text-muted-foreground'>
          Username
        </Label>
        <Input name='username' id='username' />
        <br />
        <Label htmlFor='password' className='text-muted-foreground'>
          Password
        </Label>
        <Input type='password' name='password' id='password' />
        <br />
      </AuthForm>
      {/* <div className='mt-4 text-sm text-center text-muted-foreground'>
        Don&apos;t have an account yet?{' '}
        <Link
          href='/sign-up'
          className='text-accent-foreground underline hover:text-primary'
        >
          Create an account
        </Link>
      </div> */}
    </main>
  )
}

export default Page
