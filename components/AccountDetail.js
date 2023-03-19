import React from 'react'

function AccountDetail({title, value, className}) {
    return (
        <div className={`w-full flex gap-4 px-3 py-4 justify-start items-start ${className}`}>
            <div className='w-full text-sm flex flex-col'>
                <span className='font-medium'>{title}:</span>
                <span className='text-justify'>{value}</span>
            </div>
            <button className='px-6 font-medium md:px-10 text-sm py-1 md:py-2 rounded-md border-2 hover:shadow-xl shadow-lg'>Edit</button>

        </div>
    )
}

export default AccountDetail