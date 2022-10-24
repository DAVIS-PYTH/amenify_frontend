import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export function requireAuthentication(gssp: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContext) => {
    const { req } = ctx;

    const user = req.cookies.userToken;

    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }

    return await gssp(ctx);
  };
}

export function disableAuthentication(gssp: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContext) => {
    const { req } = ctx;

    const user = req.cookies.userToken;

    if (user) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    return await gssp(ctx);
  };
}
