import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

export default function Category({data, title, filter, setFilter}) {
    const [showComponent, setShowComponent] = useState(false)
    return (
        <div className='w-full mt-2 flex flex-col'>
            <div onClick={() => setShowComponent(!showComponent)} className='cursor-pointer px-2 w-full flex justify-between items-center'>
                <span className="text-sm">{title}</span>
                <BiChevronDown />
            </div>
            <span className='px-4 font-normal text-sm'>{filter[title]}</span>

            <div className={`w-full gap-1 flex-col flex transition-all duration-1000 ${showComponent ? ' h-auto' : 'h-0'} shadow-2xl z-10 p-2`}>
                {data.map((e, i) => {
                    return (
                        showComponent && <span onClick={() => { setFilter({ ...filter, [title]: e }); setShowComponent(false) }} key={`${title}-${i}`} className='font-normal text-sm cursor-pointer'>{e}</span>
                    )
                })}
            </div>
        </div>
    )
}