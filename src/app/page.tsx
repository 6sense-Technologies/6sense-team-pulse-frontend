import MenuComponent from '@/app/components/UI/MenuComponent';
import PageTitle from '@/app/components/UI/PageTitle';
import { redirect } from 'next/navigation';
export default function Home(): JSX.Element {

  redirect("/member-list?page=1")

  return (
    <div className='relative adjustedWidthForMenu px-6 md:left-[280px]'>
      <MenuComponent currentPage={'home'} />
      <PageTitle pageName='Home' title='6sense Efficiency' />
    </div>
  );
}
