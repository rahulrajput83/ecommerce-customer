import CardLoading from '@/components/CardLoading'
import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import { useEffect, useState } from 'react'


export default function Home() {
  const [products, setProducts] = useState([]);

  const getProducts = () => {
    fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then((res) => {
      setProducts(res.products)
    })
  }

  useEffect(() => {
    getProducts();
  }, [])
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main className='w-100 flex flex-col box-border'>
        <Navbar />
        <div className='w-full px-2 md:px-4 pb-10 mt-24 md:mt-20 gap-5 gap-y-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {/* <CardLoading />
          <CardLoading />
          <CardLoading />
          <CardLoading />
          <CardLoading /> */}
          {products ?
            products.map((data, i) => {
              return (
                <Card data={data} key={i} />
              )
            })
            :
            <CardLoading />
          }
        </div>
      </main>
    </>
  )
}