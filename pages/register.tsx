import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ApiUrl, LOGIN } from '../utilities/constants';
import { disableAuthentication } from '../utilities/requireAuthentication';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth } from '../utilities/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();

// form interface
interface IFormInput {
  name: string;
  email: string;
  password: string;
}

const register: NextPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const handleRegister: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    setMessage('');
    if (cPassword !== data.password) {
      setMessage('Passwords do not match!');
      setLoading(false);
      return;
    }
    const response = await fetch(ApiUrl('/authenticate/register/'), {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
      },
    });

    const response_data = await response.json();

    if (!response.ok) {
      setLoading(false);
      setMessage(
        response_data.detail
          ? response_data.detail
          : 'Your request could not be completed'
      );
      return;
    } else {
      setLoading(false);
      document.cookie = `userToken=${response_data.token}`;
      let user_data = { name: response_data.name, email: response_data.email };
      localStorage.setItem('userDetails', JSON.stringify(user_data));
      router.push('/');
    }
  };

  const onGoogleLogin = async (google_access_token: string) => {
    const response = await fetch(ApiUrl('/social-auth/google/'), {
      method: 'POST',
      body: JSON.stringify({
        access_token: google_access_token,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    });

    const response_data = await response.json();
    if (!response.ok) {
      setLoading(false);
      setMessage(
        response_data.detail
          ? response_data.detail
          : 'Your request could not be completed'
      );
      return;
    } else {
      setLoading(false);
      document.cookie = `userToken=${response_data.access_token}`;
      let user_data = {
        name: `${response_data.user.first_name} ${response_data.user.last_name}`,
        email: response_data.user.email,
      };
      localStorage.setItem('userDetails', JSON.stringify(user_data));
      router.push('/');
    }
  };
  return (
    <main className='min-h-screen p-6 rounded-lg shadow-lg bg-white'>
      <Head>
        <title>Amenify Test - Register</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='px-6 h-full text-dark'>
        <div className='flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6'>
          {/* Login Image */}
          <div className='grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0'>
            <img
              src='/images/login.gif'
              className='w-full'
              alt='Login image'
              loading='lazy'
            />
          </div>

          {/* Login Form */}
          <div className='xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0'>
            <form onSubmit={handleSubmit(handleRegister)}>
              {/* Social Links */}
              <div className='flex flex-row items-center justify-center lg:justify-start'>
                <p className='text-lg mb-0 mr-4'>Sign up with</p>

                <button
                  type='button'
                  data-mdb-ripple='true'
                  data-mdb-ripple-color='light'
                  className='inline-block p-3 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-1'
                  onClick={() => {
                    signInWithPopup(auth, provider)
                      .then((result) => {
                        const credential =
                          GoogleAuthProvider.credentialFromResult(result);
                        onGoogleLogin(credential?.accessToken!);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-4 h-4'
                    viewBox='0 0 488 512'
                  >
                    <path
                      fill='currentColor'
                      d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
                    />
                  </svg>
                </button>
              </div>

              <div className='flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5'>
                <p className='text-center font-semibold mx-4 mb-0'>Or</p>
              </div>

              <div className='mb-6'>
                <input
                  type='text'
                  className='form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                  placeholder='Full Name'
                  {...register('name', { required: true })}
                />
              </div>

              <div className='mb-6'>
                <input
                  type='email'
                  className='form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                  placeholder='Email address'
                  {...register('email', { required: true })}
                />
              </div>

              <div className='mb-6'>
                <input
                  type='password'
                  className='form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                  placeholder='Password'
                  {...register('password', { required: true })}
                />
              </div>
              <div className='mb-6'>
                <input
                  type='password'
                  className='form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                  placeholder='Confirm Password'
                  onChange={(e) => setCPassword(e.target.value)}
                />
              </div>

              <div className='flex flex-col p-5'>
                {errors.name && (
                  <span className='text-red-500'>
                    - The Name Field is required
                  </span>
                )}
                {errors.email && (
                  <span className='text-red-500'>
                    - The Email Field is required
                  </span>
                )}
                {errors.password && (
                  <span className='text-red-500'>
                    - The Password Field is required
                  </span>
                )}
                {message && <span className='text-red-500'>- {message}</span>}
              </div>

              <div className='text-center lg:text-left'>
                <button
                  type='submit'
                  className='inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
                  disabled={loading}
                >
                  {loading ? '...' : 'Register'}
                </button>
                <p className='text-sm font-semibold mt-2 pt-1 mb-0'>
                  Already have an account?
                  <a
                    href={LOGIN}
                    className='text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out ml-2'
                  >
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default register;

export const getServerSideProps: GetServerSideProps = disableAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
