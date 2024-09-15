import MenuComponent from '@/app/components/UI/MenuComponent';
import PageTitle from '@/app/components/UI/PageTitle';
export default function Home(): JSX.Element {
  return (
    <div className='relative adjustedWidthForMenu px-6 md:left-[280px]'>
      <MenuComponent currentPage={'home'} />
      <PageTitle pageName='Home' title='6sense Efficiency' />
      <section className="mt-[18px]">
        <h3 className='text-sm md:text-2xl font-semibold'>Welcome to 6sense Efficiency</h3>
      </section>
    </div>
  );
}
