export default function CardLoading() {
    return (
        <div className=" flex flex-col max-w-sm  w-full mx-auto">
            <div className="animate-pulse flex flex-col gap-5">
                <div className=" bg-slate-200 w-full h-28 md:h-56"></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}