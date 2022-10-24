import { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';

import NavButton from './NavButton';
import Profile from './Profile';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Perform localStorage action
    let userDataToSet = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails')!)
      : null;

    setUserData(() => userDataToSet);
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <nav className='flex justify-between p-2 md:ml-6 md:mr-6 relative text-secondary'>
      <NavButton
        dotColor='#EE4B2B'
        color='#3c67ff'
        icon={<AiOutlineMenu />}
        customFunc={handleClick}
      />

      <div
        className='flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg'
        onClick={handleClick}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 496 512'
          className='w-8 h-8'
        >
          <path
            fill='#3c67ff'
            d='M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z'
          />
        </svg>
        <p>
          <span className='text-dark text-14'>Hi,</span>{' '}
          <span className='text-dark font-bold ml-1 text-14'>
            {userData && userData.name.split(' ')[0]}
          </span>
        </p>
        <MdKeyboardArrowDown className='text-dark w-[14px]' />

        {open && <Profile />}
      </div>
    </nav>
  );
};

export default Navbar;
