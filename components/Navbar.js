import Link from "next/link";
import { useRouter } from "next/router"
import { useState } from "react";
import { BiCart, BiHomeAlt2, BiLogIn, BiSearch, BiUser } from 'react-icons/bi'

export default function Navbar({ setSearchQuery, cart }) {
    const router = useRouter();
    const [input, setInput] = useState('')

    const handlebtn = () => {
        if (router.pathname.includes('login')) {
            router.push('/')
            return;
        }
        router.push('/login')
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(input)
    }
    return (
        <div className={`flex flex-row fixed z-10 gap-2 sm:gap-5 w-full items-center bg-red-500 ${router.pathname.includes('cart') ? 'justify-end' : 'justify-center'} p-3 box-border`}>
            <Link href='/' className={`text-white ${!router.pathname.includes('cart') ? 'hidden' : ''} sm:block font-medium mr-auto text-base`}><span className="font-semibold text-lg">EASY</span> ORDER</Link>
            {(router.pathname.includes('cart') || router.pathname.includes('login')) ? null :
                <form onSubmit={handleSubmit} className="flex flex-row relative w-full sm:w-2/3 md:w-1/3 justify-center items-center">
                    <input onChange={(e) => setInput(e.target.value)} className="w-full font-medium py-2 rounded-full bg-white outline-none text-sm px-3" type='text' placeholder="Search" />
                    <button type="submit" className="bg-red-200 rounded-full hover:bg-red-100 cursor-pointer absolute flex w-10 justify-center items-center right-0 h-full">
                        <BiSearch className="" />
                    </button>
                </form>}

            <Link href={router.pathname.includes('cart') ? '/' : '/cart'} className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-semibold bg-white'>
                {router.pathname.includes('cart') ?
                    <>
                        <BiHomeAlt2 className="text-xl" />
                        <span className="text-sm hidden sm:block">Home</span>
                    </> :
                    <>
                        <BiCart className="text-xl " />
                        <span className="text-sm hidden sm:block">Cart</span>
                        <span className="text-sm">{cart && cart.length}</span>
                    </>
                }

            </Link>

            <button onClick={handlebtn} className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-semibold bg-white'>
                {router.pathname.includes('login') ?
                    <>
                        <BiHomeAlt2 className="text-xl" />
                        <span className="text-sm hidden sm:block">Home</span>
                    </>
                    :
                    <>
                        <BiUser className="text-xl" />
                        <span className="text-sm hidden sm:block">Account</span>
                    </>}
            </button>
        </div>
    )
}
