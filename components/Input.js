function Input({ placeholder, name, value, data, setData, type }) {

    const handleData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    return (
        <input type={type} onChange={handleData} value={value} name={name} placeholder={placeholder} className="outline-none border-[0.14rem] border-red-500 rounded-full font-medium autofill:bg-red-500 text-sm px-3 py-2" />
    )
}

export default Input