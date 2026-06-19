import CardWithSearch from '@/components/CardWithSearch'
import Notifications from '@/components/Notifications'
import { checkUser } from '@/lib/clerk'

function page() {
  const clerk_user = checkUser();
  return (
    <div className='md:flex md:gap-4 w-full'>
      <div className='w-full px-4'>
        {/* <WelcomeBanner/> */}
        <CardWithSearch/>
      </div>
      <Notifications />
    </div>
  )
}

export default page;