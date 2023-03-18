function Label({text, data, setData}) {

    const handleData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    return (
        <label onClick={handleData} className="cursor-pointer w-fit flex justify-center items-center gap-2 font-medium accent-red-500">
            <input className="cursor-pointer" type="radio" value={text} name="type" />
            <span>{text}</span>
        </label>
    )
}

export default Label