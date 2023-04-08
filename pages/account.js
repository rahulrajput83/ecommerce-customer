import AccountDetail from '@/components/AccountDetail';
import AccountEdit from '@/components/AccountEdit';
import AccountLoading from '@/components/AccountLoading';
import Navbar from '@/components/Navbar';
import { getToken } from '@/Functions/getToken';
import { Logout } from '@/Functions/Logout';
import { getRequest } from '@/Functions/Requests';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'


const accountItem = ['My Account', 'My Orders', 'Logout']

function account() {
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState('My Account');
    const [accountData, setAccountData] = useState();
    const [edit, setEdit] = useState({
        field: '',
        valueField: ''
    });
    const [order, setOrder] = useState([])

    const getAccount = async () => {
        try {
            const data = await getRequest('/api/account')
            setAccountData(data)
        } catch (error) {
            console.log('err')
        }
    }

    const getOrders = async () => {
        try {
            const data = await getRequest('/api/order')
            let responseData = data.map((e) => {
                let stillUtc = moment.utc(e.paymentDate).toDate();
                let responseTime = moment(stillUtc).local().format('LL')
                let deliveryDateTime = moment(e.deliveryDate).local().format('dddd, MMM Do YY')
                return { ...e, paymentDate: responseTime, deliveryDate: deliveryDateTime }
            })
            setOrder(responseData)
            console.log(responseData)
        } catch (error) {
            console.log('err')
        }
    }

    useEffect(() => {
        getAccount();
        getOrders();
    }, [])

    useEffect(() => {
        if (!getToken()) {
            router.push(Logout());
        }
    }, [])

    const handleItem = title => {
        if (title === 'Logout') {
            router.push(Logout());
        }
        else {
            setAccountData()
            setOrder([]);
            getAccount();
            getOrders();
            setSelectedItem(title)
        }
    }

    return (
        <>
            <Head>
                <title>Account</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
            </Head>

            <main className='w-100 flex flex-col box-border'>
                <Navbar />
                <div className='w-full px-2 md:px-4 gap-4 pb-10 mt-20 flex flex-col md:flex-row'>
                    <div className='w-full md:w-1/4'>
                        <div className='w-full flex gap-4 flex-row md:flex-col'>
                            {accountItem.map((e, i) => {
                                return (
                                    <button onClick={() => handleItem(e)} key={`accountItem-${i}`} className={`p-3 rounded-md text-sm shadow-lg font-medium ${selectedItem === e ? 'text-white bg-red-500' : 'text-black'}`}>{e}</button>
                                )
                            })}
                        </div>
                    </div>
                    <div className='w-full gap-3 md:w-3/4 justify-start items-center flex flex-col'>
                        <span className='text-xl font-medium'>{selectedItem}</span>
                        {selectedItem === 'My Account' && accountData ?
                            <div className='w-full px-1 md:w-11/12 flex flex-col'>
                                <AccountDetail setEdit={setEdit} title='Name' value={accountData.name} valueField='name' className='border-2 rounded-tl-lg rounded-tr-lg' />
                                <AccountDetail setEdit={setEdit} title='E-mail' value={accountData.email} valueField='email' className='border-2 border-t-0' />
                                <AccountDetail setEdit={setEdit} title='Mobile Number' value={accountData.number} valueField='number' className='border-2 border-t-0' />
                                <AccountDetail setEdit={setEdit} title='Delivery Address' value={accountData.address} valueField='address' className='border-2 rounded-bl-lg border-t-0 rounded-br-lg' />
                                {edit.field && <AccountEdit getAccount={getAccount} setEdit={setEdit} edit={edit} accountData={accountData} />}
                            </div>
                            : selectedItem === 'My Account' && <AccountLoading />
                        }
                        {selectedItem === 'My Orders' && order.length > 0 ?
                            <div className='w-full gap-4 px-1 md:w-11/12 flex flex-col'>
                                {order.map(({ id, products, deliveryDate, paymentStatus, grandTotal, orderId, paymentDate, deliveredDate, deliveryStatus }) => {
                                    return (
                                        <div className={`w-full rounded flex border-2 border-gray-200 flex-col justify-start items-start`} key={id}>
                                            <div className='w-full flex text-xs font-medium p-4 gap-4 items-center  justify-between rounded-br-none rounded-bl-none bg-gray-200'>
                                                <div className='flex flex-col justify-center items-center'>
                                                    <span>ORDER PLACED</span>
                                                    <span>{paymentDate}</span>
                                                </div>
                                                <div className='flex flex-col justify-center items-center'>
                                                    <span>TOTAL</span>
                                                    <span>&#x20b9; {grandTotal}</span>
                                                </div>
                                                <div className='hidden md:flex  flex-col justify-center items-center'>
                                                    <span>Order ID</span>
                                                    <span>{orderId}</span>
                                                </div>
                                            </div>
                                            <div className='flex w-full gap-2 px-2 pt-2 relative'>
                                                <img src={products[0].product.thumbnail} alt='' className='bg-cover w-24 md:w-36 h-24 md:h-36 bg-no-repeat' />
                                                <div className='w-full flex flex-col md:gap-2'>
                                                    <Link href={`/product/${products[0].product.id}`} className='text-sm font-medium text-red-500'>{products[0].product.title}</Link>
                                                    {deliveryStatus ?
                                                        <span className='text-xs font-medium'>Delivered on <span className='font-semibold'>{deliveredDate}</span></span>
                                                        :
                                                        <span className='text-xs font-medium'>Delivery Date: <span className='font-semibold'>{deliveryDate}</span></span>
                                                    }

                                                    {products.length > 1 && <span className='text-xs absolute left-0 top-0 bg-red-500 px-3 py-2 font-medium text-white'>{products.length - 1}+</span>}
                                                    <div className='flex md:hidden text-xs gap-2 font-medium'>
                                                        <span>Order ID: </span>
                                                        <span>{orderId}</span>
                                                    </div>
                                                    <Link href={`/order/${id}`} className='p-2 text-xs mt-2 rounded w-fit uppercase text-white font-medium bg-red-500 hover:bg-red-400'>View Order</Link>
                                                </div>
                                                <span className='absolute right-2 top-0 text-sm font-semibold text-red-500'>{paymentStatus ? 'PAID' : 'UNPAID'}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            : selectedItem === 'My Orders' && <AccountLoading />
                        }
                    </div>

                </div>
            </main>
        </>

    )
}

export default account;