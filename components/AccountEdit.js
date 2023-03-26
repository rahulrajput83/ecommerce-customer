import { useEffect, useState } from "react"

function AccountEdit({ edit, accountData, setEdit }) {
    const [inputValue, setInputValue] = useState('')
    useEffect(() => {
        if (accountData[edit.valueField] === 'Empty') {
            setInputValue('')
        }
        else {
            setInputValue(accountData[edit.valueField])
        }
    }, [])

    const handleChanges = () => {
        setEdit({
            field: '',
            path: '',
            valueField: ''
        })
    }
    return (
        <div className="w-full absolute top-0 bottom-0 right-0 justify-center items-center z-20 left-0 flex">
            <div className="flex flex-col w-full h-fit md:w-5/12 bg-white shadow-2xl gap-4 p-3">
                <span className="text-lg font-semibold">{edit.field}:</span>
                <input onChange={(e) => setInputValue(e.target.value)} value={inputValue} className="outline-none focus:shadow-lg focus:shadow-red-200 p-2 border-[0.14rem] border-red-500" />
                <button onClick={handleChanges} className="ml-auto text-sm font-medium bg-red-500 rounded p-2 text-white hover:bg-red-400">Save changes</button>
            </div>
        </div>
    )
}

export default AccountEdit