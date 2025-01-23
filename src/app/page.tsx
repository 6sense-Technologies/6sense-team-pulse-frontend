
import PageTitle from '@/components/PageTitle';
import { redirect } from 'next/navigation';
export default function Home(): JSX.Element {

  redirect("/sign-in");

  return (
    <div className='relative adjustedWidthForMenu px-6 md:left-[280px]'>
      {/* <MenuComponent currentPage={'home'} /> */}
      <PageTitle pageName='Home' title='6sense Efficiency' />
    </div>
  );
}
