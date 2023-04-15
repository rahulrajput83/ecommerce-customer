import CardLoading from '@/components/CardLoading'
import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Category from '@/components/Category'
import ErrorComponent from '@/components/ErrorComponent'
import { useWindowSize } from '@/Functions/GetWidth'
import { addToCart } from '@/Functions/addToCart'
import { getRequest } from '@/Functions/Requests'

const categories = ['Electronics', 'Footwear', 'Home, Kitchen, Pets', 'Beauty, Health, Grocery', 'Books', "Men's Fashion", "Women's Fashion", "Kid's Fashion"]
const price = ['Under ₹1,000', '₹1,000 - ₹5,000', '₹5,000 - ₹10,000', 'Over ₹10,000']
const productOrder = ['Low to High', 'High to Low']

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    Category: '',
    Price: '',
    productOrder: ''
  })
  const size = useWindowSize();
  const [showFilter, setShowFilter] = useState(false)
  const [cartData, setCartData] = useState([])
  const [error, setError] = useState(false)

  const getProducts = (title) => {
    setLoading(true)
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then((res) => {
        if (res.products.length > 0) {
          setLoading(false)
          if (title) {
            const filter = res.products.filter((e) => { return (e.category.toLowerCase().includes(title.toLowerCase()) || e.title.toLowerCase().includes(title.toLowerCase())) })
            setProducts(filter)
            return;
          }
          setProducts(res.products)
        }

      })
      .catch(() => {
        setError(true)
        setTimeout(() => {
          setError(false)
        }, 3000)
      })
  }

  useEffect(() => {
    getProducts();
  }, [])

  useEffect(() => {
    setProducts([])
    getProducts(searchQuery);
  }, [searchQuery])

  const getCart = async () => {
    const response = await getRequest('/api/findAllCart')
    setCartData(response || [])
  }

  const handleAddToCart = async (item) => {
    await addToCart(item);
    getCart();
    return;
  }

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main className='w-100 flex flex-col box-border'>
        <Navbar cartData={cartData} setSearchQuery={setSearchQuery} />
        {error && <ErrorComponent />}
        <div className='w-full grid px-2 md:px-4 gap-4 pb-10 mt-20 md:mt-20 grid-cols-1 md:grid-cols-5'>
          <div className='md:col-span-1 gap-2 font-medium flex flex-col'>
            <span onClick={() => {
              size.width <= 768 ?
                setShowFilter(!showFilter) :
                console.log(size.width)
            }} className='md:text-lg text-sm  bg-red-500 text-white px-4 py-2 md:p-0 md:text-black md:bg-transparent md:rounded-none rounded-full ml-auto md:ml-0'>Filters</span>
            <Category showFilter={showFilter} data={categories} title='Category' filter={filter} setFilter={setFilter} />
            <Category showFilter={showFilter} data={price} title='Price' filter={filter} setFilter={setFilter} />
            <div className={` w-full gap-2 ${showFilter ? 'flex' : 'hidden'} md:flex mt-4`}>
              {productOrder.map((e, i) => {
                return (
                  <span onClick={() => setFilter({ ...filter, productOrder: e })} className={`py-1 px-2 border-2 border-red-500  rounded-full text-sm text-red-500 cursor-pointer ${filter.productOrder === e ? 'bg-red-500 text-white' : ''}`} key={`productOrder${i}`}>{e}</span>
                )
              })}
            </div>
          </div>
          <div className='w-full md:col-span-4  gap-5 gap-y-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {products && products.length > 0 ?
              products.map((data, i) => {
                return (
                  <Card data={data} handleAddToCart={handleAddToCart} key={i} />
                )
              })
              :
              loading
                ?
                <>
                  <CardLoading />
                  <CardLoading />
                  <CardLoading />
                  <CardLoading />
                </>
                :
                <div className='font-medium w-full flex col-span-4 justify-center text-lg'>No Product Found</div>
            }
          </div>
        </div>
      </main>
    </>
  )
}
