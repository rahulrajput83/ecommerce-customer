export default function ProductLoading() {
    return (
        <div className='w-full animate-pulse grid gap-6 grid-cols-1 md:grid-cols-12'>
            <div className='flex flex-row md:flex-col gap-4 order-2 md:order-1 overflow-scroll md:overflow-hidden w-full md:col-span-1'>
                <div className='md:w-full w-20 h-20 bg-slate-200' ></div>
                <div className='md:w-full w-20 h-20 bg-slate-200' ></div>
                <div className='md:w-full w-20 h-20 bg-slate-200' ></div>
                <div className='md:w-full w-20 h-20 bg-slate-200' ></div>
            </div>
            <div className='md:col-span-4 w-full order-1 md:order-2 bg-slate-200 h-80'>
            </div>
            <div className='md:col-span-4 order-4 bg-slate-200 md:order-3 w-full h-52 flex flex-col'>
            </div>
            <div className='md:col-span-3 gap-1 p-2 md:p-4 order-3 bg-slate-200 h-52 md:order-4 rounded shadow-lg w-full flex flex-col justify-start items-start'>
            </div>
        </div>
    )
}