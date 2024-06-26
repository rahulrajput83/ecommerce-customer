import { getRequest } from "@/Functions/Requests";
import { getToken } from "@/Functions/getToken";
import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { BiCart, BiHomeAlt2, BiSearch, BiUser } from 'react-icons/bi'

export default function Navbar({ setSearchQuery, cartData, searchQuery }) {
    const router = useRouter();
    const [cart, setCart] = useState(cartData)
    const [input, setInput] = useState('')

    const getCart = async() => {
        const response = await getRequest('/api/findAllCart')
        setCart(response)
    }

    useEffect(() => {
        getCart();
    }, [cartData])

    const handlebtn = () => {
        if (router.pathname.includes('login') || router.pathname.includes('register') || router.pathname.includes('account')) {
            router.push('/')
            return;
        }
        if (getToken()) {
            router.push('/account')
        }
        else {
            router.push('/login')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(input)
    }
    return (
        <div className={`flex flex-row fixed z-20 gap-2 sm:gap-5 w-full items-center bg-red-500 ${router.pathname.includes('cart') ? 'justify-end' : 'justify-center'} p-3 box-border`}>
            <Link href='/' className={`text-white ${(router.pathname.includes('cart') || router.pathname.includes('login') || router.pathname.includes('register') || router.pathname.includes('/product') || router.pathname.includes('/paymentStatus') || router.pathname.includes('/account') || router.pathname.includes('/order')) ? '' : 'hidden'} sm:block font-medium mr-auto text-base`}><span className="font-semibold text-lg">EASY</span> ORDER</Link>
            {(router.pathname.includes('cart') || router.pathname.includes('seller') || router.pathname.includes('login') || router.pathname.includes('register') || router.pathname.includes('/product') || router.pathname.includes('/account')) || router.pathname.includes('/paymentStatus') || router.pathname.includes('/order') ? null :
                <form onSubmit={handleSubmit} className="flex flex-row relative w-full sm:w-2/3 md:w-1/3 justify-center items-center">
                    <input value={searchQuery} onChange={(e) => setInput(e.target.value)} className="w-full font-medium placeholder:font-medium py-2 rounded-full bg-white outline-none text-sm px-3" type='text' placeholder="Search" />
                    <button type="submit" className="bg-red-200 font-medium rounded-full hover:bg-red-100 cursor-pointer absolute flex w-10 justify-center items-center right-0 h-full">
                        <BiSearch className="" />
                    </button>
                </form>}

            <Link href={router.pathname.includes('cart') ? '/' : '/cart'} className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-medium bg-white'>
                {router.pathname.includes('cart') ?
                    <>
                        <BiHomeAlt2 className="text-xl" />
                        <span className="text-sm hidden sm:block">Home</span>
                    </> :
                    <>
                        <BiCart className="text-xl " />
                        <span className="text-sm hidden sm:block">Cart</span>
                        <span className="text-sm">{cart && cart.length || '0'}</span>
                    </>
                }

            </Link>

            <button onClick={handlebtn} className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-medium bg-white'>
                {router.pathname.includes('login') || router.pathname.includes('register') || router.pathname.includes('/account') ?
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
