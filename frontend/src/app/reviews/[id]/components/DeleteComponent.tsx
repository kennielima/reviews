"use client"
import { deleteReview } from '@/app/hooks/useDeleteReview';
import Modal from '@/components/Modal';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const DeleteComponent = ({ id }: { id: string }) => {
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false)

    const router = useRouter()

    const deleteHandler = async () => {
        try {
            await deleteReview(id);
            router.push('/');

        } catch (error) {
            setError((error as Error).message)
        }
    }
    return (
        <div className='grid gap-4'>
            <button
                className='bg-indigo-600  mx-auto hover:bg-opacity-80 w-fit rounded-md mt-4 text-white px-4 py-2'
                onClick={() => setIsOpen(true)}
            >
                Delete
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div
                    className='flex w-full justify-end text-gray-600 cursor-pointer'
                    onClick={() => setIsOpen(false)}
                >
                    <X />
                </div>
                <p className="flex w-full justify-center my-4">Are you sure you want to delete this review?</p>
                <div className='flex w-full justify-center'>
                    <button
                        className='bg-indigo-600 mx-auto hover:bg-opacity-80 w-fit rounded-md text-white px-4 py-2'
                        onClick={deleteHandler}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
            {error && (
                <div className="bg-red-100 w-fit mx-auto border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
        </div>
    )
}

export default DeleteComponent



// TODO USER PAGE
// TODO COMMENTING SYSTEM
// if reviewed, shdnt be able to rate
// REFACTOR: 1.optimize search functionality 5. product->brand
// search for brands on brand page
// Scalability: 1. pagination/load more, 2. caching
// faq, what we do