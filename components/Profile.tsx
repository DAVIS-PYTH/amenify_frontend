import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { LOGIN } from '../utilities/constants';

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Perform localStorage action
    let userDataToSet = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails')!)
      : null;

    setUserData(() => userDataToSet);
  }, []);

  const logoutHandler = async () => {
    await localStorage.removeItem('userDetails');
    document.cookie =
      'userToken=; Max-Age=0; path=/; domain=' + location.hostname;
    document.cookie = 'userToken=; Max-Age=0; path=/; domain=' + location.host;
    router.push(LOGIN);
  };
  return (
    <div className='z-[10000] shadow shadow-dark absolute right-0 top-16 bg-white p-8 rounded-lg w-full sm:w-96'>
      <div className='flex justify-between items-center'>
        <p className='font-semibold text-lg '>User Profile</p>
        <button className='text-[#EE4B2B] text-xl rounded-full p-3 hover:bg-light'>
          <FaTimesCircle />
        </button>
      </div>
      <div className='flex gap-5 items-center mt-6 border-color border-b-1 pb-6'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 496 512'
          className='w-24 h-24'
        >
          <path
            fill='#3c67ff'
            d='M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z'
          />
        </svg>
        <div>
          <p className='font-semibold text-xl'>{userData?.name} </p>
          <p className='text-gray-500 text-sm '> Employee </p>
          <p className='text-gray-500 text-sm font-semibold '>
            {userData?.email}
          </p>
        </div>
      </div>
      <div className='mt-5'>
        <button
          className='p-3 w-full hover:drop-shadow-xl bg-secondary text-white rounded-[10px] '
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
