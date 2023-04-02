import Navbar from '../components/Navbar'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
import { BiMap, BiMinus, BiPlus } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import Link from 'next/link'
import AccountEdit from '@/components/AccountEdit'
import { getRequest } from '@/Functions/Requests'
import SmallLoading from '@/components/SmallLoading'
import Loading from '@/components/Loading'
import { getToken } from '@/Functions/getToken'

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)


export default function Cart() {
    const [cart, setCart] = useState([]);
    const [productPrice, setProductPrice] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [taxPrice, setTaxPrice] = useState(0);
    const [accountData, setAccountData] = useState({})
    const [edit, setEdit] = useState({
        field: '',
        valueField: ''
    });
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState('')


    const getLocalStorage = () => {
        setProductPrice(0);
        setShippingPrice(0)
        setFinalPrice(0)
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(localCart)
    }

    const getAccount = async () => {
        try {
            const data = await getRequest('/api/account')
            setAccountData(data)
        } catch (error) {
            console.log('err')
        }
    }

    const handleEdit = (title, valueField) => {
        setEdit({ field: title, valueField: valueField })
    }

    useEffect(() => {
        getAccount();
        getLocalStorage();
        setToken(getToken())
    }, [])

    /* Increase Quantity of Product */
    const AddQuantity = (item) => {
        const increaseItem = [...cart]
        const findIndex = increaseItem.findIndex((e) => e.id === item.id);
        increaseItem[findIndex].quantity++;
        localStorage.setItem('cart', JSON.stringify(increaseItem));
        getLocalStorage();
    }

    /* Decrease Quantity of Product */
    const MinusQuantity = (item) => {
        const increaseItem = [...cart]
        const findIndex = increaseItem.findIndex((e) => e.id === item.id);
        increaseItem[findIndex].quantity > 1 ? increaseItem[findIndex].quantity-- : 1;
        localStorage.setItem('cart', JSON.stringify(increaseItem));
        getLocalStorage();
    }

    /* Remove PRoduct from Cart */
    const RemoveCart = (item) => {
        const increaseItem = [...cart]
        const findIndex = increaseItem.findIndex((e) => e.id === item.id);
        increaseItem.splice(findIndex, 1)
        localStorage.setItem('cart', JSON.stringify(increaseItem));
        getLocalStorage();
    }

    useEffect(() => {
        calculatePrice();
    }, [cart])

    /* Calculate Prices */
    const calculatePrice = () => {
        if (cart.length > 0) {
            const price = cart.reduce((total, item, index, arr) => {
                const quantity = arr[index].quantity * item.price;
                return total + quantity;
            }, 0);
            const shipping = 100;
            setProductPrice(price);
            setShippingPrice(shipping);
            /* Tax Percentage */
            const taxPercentage = 3;
            const tax = price * taxPercentage / 100;
            setTaxPrice(tax)
            setFinalPrice(price + shipping + tax);
        }
    }

    const handlePayment = () => {
        if (!accountData.address && !accountData.number) {
            alert('Please add address and mobile number.')
            return;
        }
        setLoading(true)
        fetch('/api/payment', {
            method: 'POST',
            body: JSON.stringify({
                amount: finalPrice,
                purpose: 'Product Purchase',
                redirect: `https://rahulrajput83-ecommerce.vercel.app/paymentStatus`,
                email: accountData.email,
                number: accountData.number,
                name: accountData.name,
                id: accountData.id,
                product: cart,
                address: accountData.address,
                tax: taxPrice,
                grandTotal: finalPrice,
                subTotal: productPrice,
                shippingCharges: shippingPrice
            })
        })
            .then(res => res.json())
            .then((res) => {
                setLoading(false)
                if (res.message === 'Success') {
                    window.location.replace(res.data)
                }
                else {
                    console.log('Error')
                }
            })
            .catch(() => {
                console.log('err')
            })
    }

    return (
        <>
            <Head>
                <title>Cart</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
            </Head>

            <main className='w-full'>
                <Navbar cart={cart} />
                <main className='w-full flex flex-col md:flex-row box-border'>
                    <div className='mt-20 md:mt-16 px-2 md:px-16 pb-4 md:pb-10 w-full flex flex-col'>
                        <span className='text-xl uppercase font-semibold mb-4 text-red-500 mx-auto'>Cart</span>
                        {cart && cart.length > 0 ?
                            <div className='w-full grid gap-6 justify-start items-start grid-cols-1 md:grid-cols-3'>
                                <div className='md:col-span-2 justify-start items-start font-medium flex flex-col gap-4 p-2 md:p-4 shadow-lg'>
                                    <span>Total Item : {cart.length}</span>
                                    {cart.map((item, i) => {
                                        return (
                                            <div key={`cart${i}`} className='w-full relative flex gap-4 flex-row justify-start items-start'>
                                                <img alt='' src={item.thumbnail} className='bg-cover w-24 md:w-44 h-24 md:h-44 bg-no-repeat' />
                                                <div className='flex flex-col w-full'>
                                                    <div className='font-medium flex justify-between items-center w-full'>
                                                        <Link href={`/product/${item.id}`} className='w-full text-red-500 p-0 m-0'>
                                                            <ResponsiveEllipsis
                                                                text={item.title}
                                                                maxLine='1'
                                                                ellipsis='...'
                                                                trimRight
                                                                basedOn='letters'
                                                            />
                                                        </Link>
                                                        <button onClick={() => RemoveCart(item)} className='font-semibold text-red-500 z-10 text-xl bg-white'>
                                                            <MdDeleteOutline />
                                                        </button>
                                                    </div>
                                                    <span className='font-medium text-xs'>
                                                        <ResponsiveEllipsis
                                                            text={item.description}
                                                            maxLine='3'
                                                            ellipsis='...'
                                                            trimRight
                                                            basedOn='letters'
                                                        />
                                                    </span>
                                                    <div className='flex gap-4 mt-4 items-center'>
                                                        <button onClick={() => MinusQuantity(item)} className='p-2 bg-red-500 text-white'>
                                                            <BiMinus />
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => AddQuantity(item)} className='p-2 bg-red-500 text-white'>
                                                            <BiPlus />
                                                        </button>
                                                    </div>
                                                </div>

                                                <span className='font-semibold absolute left-0 px-2 py-1 bg-red-500 text-white z-10 text-sm'>&#x20b9; {item.price}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className='md:col-span-1 justify-start h-auto items-start flex flex-col p-2 md:p-4 shadow-lg'>
                                    <span className='mb-2 text-lg font-semibold'>Summary</span>
                                    <div className='w-full font-medium flex flex-row justify-between items-center'>
                                        <span className='font-medium'>Product Price</span>
                                        <span className='font-semibold'>&#x20b9; {productPrice}</span>
                                    </div>
                                    <div className='w-full font-medium flex flex-row justify-between items-center'>
                                        <span className='font-medium'>Shipping Charges</span>
                                        <span className='font-semibold'>&#x20b9; {shippingPrice}</span>
                                    </div>
                                    <div className='w-full font-medium flex flex-row justify-between items-center'>
                                        <span className='font-medium'>Tax</span>
                                        <span className='font-semibold'>&#x20b9; {taxPrice}</span>
                                    </div>
                                    <div className='w-full font-medium flex flex-row justify-between items-center'>
                                        <span className='font-medium'>Final Price</span>
                                        <span className='font-semibold'>&#x20b9; {finalPrice}</span>
                                    </div>
                                    {token &&
                                        <div className='w-full mt-6 flex flex-col items-center justify-center'>
                                            <div className='w-full flex items-center gap-2'>
                                                <BiMap className='text-lg' />
                                                <span className='font-medium mr-auto'>Address</span>
                                                <button onClick={() => handleEdit('Delivery Address', 'address')} className='py-1 px-3 bg-red-500 text-white text-sm font-medium rounded-full border-[0.14rem] border-red-500 hover:bg-white hover:text-red-500'>Edit</button>
                                            </div>
                                            {accountData && accountData.address ?
                                                <div className='w-full inline'>
                                                    <span className='text-sm'>{accountData.address}</span>
                                                    <span className='text-sm font-medium ml-1'>{accountData.number}</span>
                                                </div>
                                                :
                                                <SmallLoading />
                                            }

                                        </div>
                                    }
                                    {token ? <button onClick={handlePayment} className='w-full font-medium bg-red-500 py-2 mt-8 mb-1 text-white text-sm rounded-full hover:text-red-500 border-[0.14rem] border-red-500 hover:bg-white'>Continue to payment</button>
                                        :
                                        <Link href='/login' className='w-full font-medium bg-red-500 text-center py-2 mt-8 mb-1 text-white text-sm rounded-full hover:text-red-500 border-[0.14rem] border-red-500 hover:bg-white'>Login</Link>}
                                    {accountData ?
                                        edit.field && <AccountEdit getAccount={getAccount} setEdit={setEdit} edit={edit} accountData={accountData} />
                                        : null}

                                </div>
                                {loading ? <Loading /> : null}
                            </div>
                            :
                            <div className='flex justify-center gap-2  text-lg items-center font-medium'>
                                <span>Your Cart is empty !!</span>
                                <Link href='/' className='border-[0.14rem] hover:bg-red-500 rounded-full hover:text-white border-red-500 px-4 py-[0.14rem]'>Home</Link>
                            </div>
                        }
                    </div>
                </main>
            </main>
        </>
    )
}
