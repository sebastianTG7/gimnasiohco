import React from 'react';

const SwipeableMenu = ({ isOpen, onClose, children }) => {
  return (
    <main
      className={
        "fixed overflow-hidden z-10 bg-gray-900 bg-opacity-50 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 translate-x-0  "
          : " transition-all delay-500 opacity-0 translate-x-full  ")
      }
    >
      <section
        className={
          " w-64 max-w-lg right-0 absolute bg-gray-900 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <article className="relative w-64 max-w-lg pb-10 flex flex-col space-y-6 overflow-y-auto h-full p-4">
          {children}
        </article>
      </section>
      <section
        className=" w-screen h-full cursor-pointer "
        onClick={onClose}
      ></section>
    </main>
  );
};

export default SwipeableMenu;
