import Link from "next/link";
import { BiCartAdd } from "react-icons/bi";
import {FaStar} from 'react-icons/fa'


export default function Card(props) {
    const { title, price, thumbnail, rating, id } = props.data;

    return (
        <div className="flex group flex-col w-full">
            <div className="flex flex-col w-full gap-2">
                <Link href={`/product/${id}`} className="w-full flex flex-col cursor-pointer gap-1">
                    <div className="w-full flex gap-2 justify-start  relative items-start">
                        <img alt="" src={thumbnail} className="bg-cover  bg-slate-200 w-full h-28 md:h-56" />
                        <div className="absolute right-0 bg-red-500 p-2 text-sm font-medium text-white">&#x20b9; {price}</div>
                    </div>
                    <div className="w-full truncate font-semibold">{title}</div>
                </Link>
                <div className="w-full pb-2 flex gap-2 justify-center items-center">

                    <div className="w-auto flex justify-center gap-1 items-center">
                        <FaStar className="m-auto text-red-500"/>
                        <span className="text-sm m-auto font-medium">{rating}</span>
                    </div>
                    <div onClick={() => props.handleAddToCart(props.data)} className="w-full cursor-pointer hover:bg-red-400 flex p-2 rounded text-white gap-2 bg-red-500 justify-center items-center">
                        <BiCartAdd className="text-lg" />
                        <span className="uppercase font-medium text-sm">Add</span>
                    </div>
                </div>

            </div>
        </div>
    )
}