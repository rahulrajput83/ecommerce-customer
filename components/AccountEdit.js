import { putRequest } from "@/Functions/Requests";
import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"

function AccountEdit({ edit, accountData, setEdit, getAccount }) {
    const [inputValue, setInputValue] = useState('');
    const [invalid, setInvalid] = useState(false)
    useEffect(() => {
        if (accountData[edit.valueField] === 'Empty') {
            setInputValue('')
        }
        else {
            setInputValue(accountData[edit.valueField])
        }
    }, [])

    const handleChanges = async(e) => {
        e.preventDefault();
        if (edit.valueField === 'number' && inputValue && inputValue.length === 10) {
            setInvalid(false)
        }
        else if (edit.valueField === 'number' && inputValue) {
            setInvalid(true)
            return;
        }
        else {
            setInvalid(false)
        }
        const data = await putRequest('/api/account-update', edit.valueField, inputValue);
        if(data.message === 'Success') {
            getAccount();
        }
        empty();
    }

    const empty = () => {
        setEdit({
            field: '',
            valueField: ''
        })
    }
    return (
        <div className="w-full absolute top-0 bottom-0 right-0 justify-center items-center z-20 left-0 flex">
            <div className="flex flex-col w-full h-fit md:w-5/12 bg-white shadow-2xl gap-4 p-3">
                <div className="w-full flex flex-row items-center justify-between">
                    <span className="text-base font-medium">{edit.field}:</span>
                    <MdClose onClick={empty} className="cursor-pointer" />
                </div>
                <form onSubmit={handleChanges} className="flex w-full flex-col gap-4">
                    <input type={edit.valueField === 'name' ? 'text' : edit.valueField === 'email' ? 'email' : edit.valueField === 'number' ? 'number' : 'text'} onChange={(e) => setInputValue(e.target.value)} value={inputValue} className="outline-none text-sm focus:shadow-md font-medium placeholder:font-medium focus:shadow-red-200 p-2 border-[0.14rem] border-red-500" />
                    {invalid && <span className="text-sm font-medium">Mobile Number should be of 10 digits.</span>}
                    <button type="submit" className="ml-auto text-sm font-medium bg-red-500 rounded p-2 text-white hover:bg-red-400">Save changes</button>

                </form>
            </div>
        </div>
    )
}

export default AccountEdit