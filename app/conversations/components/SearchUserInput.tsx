import React from 'react'


interface SearchUserInputProps {
    label : string,
    buttonText : string,
    fieldValue : string,
    isEmail : boolean,
    setField : React.Dispatch<React.SetStateAction<string>>,
    handleClick : (isEmail:boolean)=>void
}
export const SearchUserInput : React.FC<SearchUserInputProps> = ({
    label,
    buttonText,
    fieldValue,
    isEmail,
    setField,
    handleClick
}) => {
  return (
    <div className='flex flex-col gap-2.5'>
    <p className='text-base font-semibold text-slate-700'>{label}</p>
    <input className='text-sm sm:w-80 sm:h-10 font-semibold ring-2 ring-inset ring-blue-600 py-2 px-3 focus-visible:outline-0' type="text" value={fieldValue} onChange={(e)=>{
        setField(e.target.value)
    }}/>
    <div className='w-full flex justify-end'>
        <button onClick={()=>handleClick(isEmail)} className='bg-blue-600 hover:bg-blue-800 transition rounded-sm w-fit px-3 py-1 font-medium text-white'>
            {buttonText}
        </button>
    </div>
    </div>
  )
}
