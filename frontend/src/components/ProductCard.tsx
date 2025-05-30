import { Product } from '@/lib/types'
import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


const ProductCard = ({ product }: {
    product: Product
}) => {

    return (
        <div key={product.id}>
            <div className='flex flex-col border max-w-4xl w-full border-gray-200 shadow-md p-5 rounded-md' key={product.id}>
                <div className='flex gap-1 items-center'>
                    <Link href={`products/${product.id}`} className='text-gray-800 font-semibold'>{product.name}</Link>
                    <Star
                        className='text-yellow-500 w-4 h-4 ml-1'
                        fill={"currentColor"}
                        stroke="currentColor"
                    />
                    <p className='text-gray-600 text-sm'>{product.averageRating}</p>
                </div >
                <p className='flex justify-start text-indigo-600 text-sm'>{product?.reviews?.length} review(s)</p>
                <p className=' text-sm text-start text-slate-600 py-4'>
                    {product.name} has an average rating of
                    <span className='text-indigo-600 font-semibold'> {product.averageRating}/5 </span>
                    across a total of
                    <span className='text-indigo-600 font-semibold'> {product?.reviews?.length} </span> review(s)
                    and
                    <span className='text-indigo-600 font-semibold'> {product.ratingsCount} </span> rating(s)
                </p>

                <div className='flex justify-between items-center gap-4'>
                    <span className='text-sm flex items-center gap-1 w-auto'>View more data here <ArrowRight className='text-indigo-600' /></span>
                    <Link href={`/products/${product.id}`}>
                        <button className='px-3 py-2 rounded-lg text-white font-semibold text-sm bg-indigo-600'>View Brand</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductCard