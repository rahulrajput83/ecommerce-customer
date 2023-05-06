import React from 'react'

function AccountDetail({ title, value, className, valueField, setEdit }) {
    const handleEdit = () => {
        setEdit({ field: title, valueField: valueField })
    }
    return (
        <div className={`w-full flex gap-4 px-3 py-4 justify-start items-start ${className}`}>
            <div className='w-full text-sm flex flex-col'>
                <span className='font-medium'>{title}:</span>
                <span className='w-full font-medium'>{value === 'Empty' ? '' : value}</span>
            </div>
            {title !== 'City' && <button onClick={handleEdit} className='px-6 font-medium md:px-10 text-sm py-1 md:py-2 rounded-md border-2 hover:shadow-xl shadow-lg'>Edit</button>}
        </div>
    )
}

export default AccountDetail