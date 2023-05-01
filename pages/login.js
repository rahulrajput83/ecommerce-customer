import Navbar from '../components/Navbar'
import Head from 'next/head'
import Input from '@/components/Input'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Loading from '@/components/Loading'
import { useRouter } from 'next/router'
import { getToken } from '@/Functions/getToken'
import ErrorComponent from '@/components/ErrorComponent'


export default function Login() {
    const router = useRouter();
    const [error, setError] = useState('')
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [getError, setGetError] = useState(false)

    useEffect(() => {
        if (getToken()) {
            router.push('/');
        }
    }, [])

    const handleForm = (e) => {
        e.preventDefault();
        if (data.email && data.password) {
            if (data.password.length >= 6) {
                setLoading(true)
                fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(res => res.json())
                    .then((res) => {
                        if (res.message === 'Successfully Login...') {
                            localStorage.setItem('token', res.token);
                            setLoading(false)
                            router.push('/')
                        }
                        else if (res.message && res.message.startsWith('Error')) {
                            setGetError(true)
                            setLoading(false)
                            setTimeout(() => {
                                setGetError(false)
                            }, 6000)
                        }
                        else {
                            setLoading(false)
                            setError(res.message)
                        }

                    })
                    .catch(() => {
                        setGetError(true)
                        setLoading(false)
                        setTimeout(() => {
                            setGetError(false)
                        }, 6000)
                    })
            }
            else {
                setError('Password must be at least 6 characters.')
            }
        }
        else {
            setError('Please fill all details...')
        }
    }

    useEffect(() => {
        setError('')
    }, [data])


    return (
        <>
            <Head>
                <title>Login - Customer</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
            </Head>

            <main className='w-100 flex flex-col'>
                <Navbar />
                {getError && <ErrorComponent />}
                <div className='w-full gap-4 pb-10 mt-20 flex flex-col'>
                    <form onSubmit={handleForm} className='w-full flex py-4 px-2 md:px-20 flex-col gap-8 md:w-1/2 mx-auto shadow-xl'>
                        <span className='text-center font-medium text-xl'>Login</span>
                        <Input type='email' data={data} setData={setData} placeholder='Email Address' name='email' value={data.email} />
                        <Input type='password' data={data} setData={setData} placeholder='Password' name='password' value={data.password} />
                        <div className='w-full text-sm font-medium flex gap-10'>
                            <button disabled={error ? true : false} type='submit' className='rounded-full w-full border-[0.14rem] font-medium hover:bg-white hover:text-red-500 bg-red-500 text-white border-red-500 p-2'>Login</button>
                            <Link className='rounded-full w-full border-[0.14rem] font-medium hover:bg-red-500 hover:text-white text-center bg-white text-red-500 border-red-500 p-2' href='/register'>Register</Link>
                        </div>
                        {error && <div className='w-full p-3 text-sm font-medium rounded text-white bg-red-500'>
                            {error}
                        </div>}
                    </form>
                </div>
                {loading && <Loading />}
            </main>
        </>
    )
}
