import Link from "next/link";
import { BiCartAdd } from "react-icons/bi";
import {FaStar} from 'react-icons/fa'


export default function Card(props) {
    const { title, price, thumbnail, _id } = props.data;

    return (
        <div className="flex hover:shadow-xl bg-white transition-all duration-700 rounded-md px-2 h-fit group flex-col w-full">
            <div className="flex flex-col w-full gap-2">
                <Link href={`/product/${_id}`} className="w-full flex flex-col cursor-pointer gap-1">
                    <div className="w-full flex gap-2 justify-start  relative items-start">
                        <img alt="" src={thumbnail} className="w-full md:h-80 h-40 bg-no-repeat bg-cover" />
                        <div className="absolute right-0 bg-red-500 p-2 text-sm font-medium text-white">&#x20b9; {price}</div>
                    </div>
                    <div className="w-full truncate font-font-medium">{title}</div>
                </Link>
                <div className="w-full pb-2 flex gap-2 justify-center items-center">
                    <div onClick={() => props.handleAddToCart(props.data)} className="w-full cursor-pointer hover:bg-red-400 flex p-2 rounded text-white gap-2 bg-red-500 justify-center items-center">
                        <BiCartAdd className="text-lg" />
                        <span className="uppercase font-medium text-sm">Add</span>
                    </div>
                </div>

            </div>
        </div>
    )
}