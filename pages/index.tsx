import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';
import { requireAuthentication } from '../utilities/requireAuthentication';
import { ApiUrl } from '../utilities/constants';

const Home: NextPage = ({ schedule }: any) => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <Head>
        <title>Amenify Test</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='min-h-screen p-6 rounded-lg shadow-lg bg-white w-full'>
        <div className='px-6'>
          {/* Navbar */}
          <Navbar />

          {/* Calendar */}
          <Calendar schedule={schedule} />
        </div>
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    const { req } = _ctx;
    const user = req.cookies.userToken;

    const response = await fetch(ApiUrl('/attendance/list/'), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user}`,
      },
    });

    const data = await response.json();

    let dataToSet = data.map((item: any) => {
      return { ...item, Id: item.uuid };
    });
    return {
      props: {
        schedule: dataToSet,
      },
    };
  }
);
