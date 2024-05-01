'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'

function Home() {
  const { reload } = useRouter()

  return (
    <div className='flex flex-col gap-12'>
      <section className='flex flex-col gap-6'>
        <h1 className='text-2xl font-semibold my-4'>Under Maintenance</h1>
        <h4>You can try to refresh the page to see if the issue is resolved.</h4>
        <Button variant={'ghost'} asChild onClick={reload}>
          Refresh
        </Button>
      </section>
    </div>
  )
}

export default Home
