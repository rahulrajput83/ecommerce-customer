import React from 'react'

function Error() {
    return (
        <div className="p-4 fixed right-1 top-1 z-50 w-10/12 md:w-4/12 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
            <span className="font-medium">Oops!</span> Something went wrong.
        </div>
    )
}

export default Error