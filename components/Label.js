function Label({text, data, setData}) {

    const handleData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    return (
        <label onClick={handleData} className="cursor-pointer w-fit flex justify-center items-center gap-2 text-sm font-medium accent-red-500">
            <input className="cursor-pointer placeholder:font-medium font-medium" type="radio" value={text} name="type" />
            <span>{text}</span>
        </label>
    )
}

export default Label