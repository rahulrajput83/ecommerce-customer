import Link from "next/link";
import { useRouter } from "next/router"
import { BiHomeAlt2, BiLogIn, BiSearch } from 'react-icons/bi'

export default function Navbar() {
    const router = useRouter();

    const handlebtn = () => {
        if (router.pathname.includes('login')) {
            router.push('/')
            return;
        }
        router.push('/login')
    }
    return (
        <div className="flex flex-row fixed z-10 w-full justify-center items-center bg-red-500 p-3 box-border">
            <Link href='/' className="text-white font-semibold mr-auto text-base"><span className="font-bold text-lg">EASY</span> ORDER</Link>
            <form className="flex mr-10 flex-row relative w-1/3 justify-center items-center">
                <input className="w-full py-2 rounded-full bg-white outline-none text-sm px-3" type='text' placeholder="Search" />
                <button type="submit" className="bg-red-200 hover:bg-red-100 cursor-pointer absolute flex w-10 justify-center items-center right-0 h-full">
                    <BiSearch className="" />
                </button>
            </form>

            <button onClick={handlebtn} className='py-1 px-3 flex flex-row justify-center items-center gap-1 rounded-full border-2 border-white hover:bg-red-500  hover:text-white uppercase font-semibold bg-white'>
                {router.pathname.includes('login') ?
                    <>
                        <BiHomeAlt2 className="text-xl" />
                        <span className="text-sm">Home</span>
                    </>
                    :
                    <>
                        <BiLogIn className="text-xl" />
                        <span className="text-sm">Login</span>
                    </>}
            </button>

        </div>
    )
}
