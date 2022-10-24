interface Props {
  color: string;
  customFunc?: any;
  dotColor: string;
  icon: any;
}
const NavButton = ({ customFunc, icon, color, dotColor }: Props) => (
  <button
    type='button'
    onClick={() => (customFunc ? customFunc() : null)}
    style={{ color }}
    className='relative text-xl rounded-full p-3 hover:bg-light border border-gray-400'
  >
    <span
      style={{ background: dotColor }}
      className='absolute inline-flex rounded-full h-2 w-2 right-2 top-2'
    />
    {icon}
  </button>
);

export default NavButton;
