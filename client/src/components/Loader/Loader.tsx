import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className='mx-auto w-[50px] h-[50px] border-[3px] rounded-full border-l-transparent border-t-[#aaa] border-r-[#555] border-b-[#000] mb-5 animate-spinner' />
  );
};
export default Loader;
