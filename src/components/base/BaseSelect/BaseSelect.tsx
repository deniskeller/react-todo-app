import React, { useRef, useState } from 'react';
import useOnClickOutside from 'hooks/useOnClickOutside';
import type { SelectItem } from 'constants/globals/types';

interface Props {
  className?: string;
  initialValue: SelectItem;
  options: SelectItem[];
  onChange: (value: SelectItem) => void;
}

const BaseSelect: React.FC<Props> = ({
  className,
  initialValue,
  options,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<SelectItem>(initialValue);
  const selectContainerRef = useRef(null);

  const clickOutsideHandler = () => setIsOpen(false);
  useOnClickOutside(selectContainerRef, clickOutsideHandler);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value: SelectItem) => {
    setSelectedOption(value);
    setIsOpen(false);
    onChange(value);
  };

  return (
    <div ref={selectContainerRef} className={`relative ${className}`}>
      <div
        className={`group relative cursor-pointer flex items-center leading-none text-base font-inherit w-full h-[38px] border-b-2 border-[#6b778c] transition-all duration-[500ms] ease-in-out hover:border-black ${
          isOpen ? '!border-black active-parent' : ''
        }`}
        onClick={toggling}
      >
        <p
          className={`overflow-hidden whitespace-nowrap text-ellipsis text-[#6b778c] group-hover:text-black transition-[all] duration-[500ms] ease-in-out ${
            isOpen ? 'text-black ' : ''
          }`}
        >
          {selectedOption.label}
        </p>

        <svg
          className={`w-[20px] h-[20px] ml-2 transition-[all] duration-[500ms] ease-in-out ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            className={`group-hover:stroke-black transition-[all] duration-[500ms] ease-in-out ${
              isOpen ? 'stroke-black' : ''
            }`}
            d='M5 8L10 12L15 8'
            stroke='#6b778c'
            strokeLinecap='round'
            strokeWidth='2'
          />
        </svg>
      </div>

      <ul
        className={`absolute right-0 top-[40px] z-[1000] w-auto max-w-[280px] bg-black/60 shadow-[1px_2px_10px_rgba(0,0,0,0.35)] rounded-[3px] max-h-[200px] overflow-y-auto transition-all duration-200 ease-in-out transform ${
          isOpen
            ? 'pointer-events-auto opacity-1'
            : 'pointer-events-none opacity-0'
        }`}
      >
        {options.map((option: SelectItem, index) => (
          <li
            key={index}
            className='cursor-pointer h-[40px] list-none flex items-center px-[16px] text-[#fff] hover:bg-black/40'
            onClick={() => onOptionClicked(option)}
          >
            <span className='leading-none text-base font-normal font-inherit'>
              {option.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BaseSelect;
