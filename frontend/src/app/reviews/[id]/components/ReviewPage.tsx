"use client"
import DeleteComponent from '@/components/DeleteComponent'
import RenderedStars from '@/components/renderStars'
import { User } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { useRouter } from 'next/navigation';

export type reviewTypeProps = {
    reviewData: any;
    currentUser: {
        loggedIn: boolean;
        user: User
    };
    id: string
}
const ReviewPage: React.FC<reviewTypeProps> = ({ reviewData, currentUser, id }) => {
    const router = useRouter();
    const review = reviewData?.review;

    return (
        <Fragment>
            {!review ? (
                <div className="container h-screen mx-auto px-4 py-8 text-center">
                    <h1 className="text-2xl font-bold">Review Not Found</h1>
                    <Link href='#' onClick={(e) => { e.preventDefault(); router.back() }}>
                        <button className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">
                            Back to Reviews
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Link href='#' onClick={(e) => { e.preventDefault(); router.back() }}>
                        <button className="mb-6 flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Reviews
                        </button>
                    </Link>

                    <div className="p-6 mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-4">{review.title}</h1>
                                <div className="flex items-center mb-2 space-x-4">
                                    <RenderedStars rating={review.rating} />
                                    <span className="ml-2 text-gray-600">({review.rating}/5)</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-b pb-6 mb-6 border-t pt-6 mt-6">
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    {review.brand && (
                                        <div>
                                            <Link href={`/products/${reviewData?.review?.productId}`} className='hover:text-gray-500'>
                                                <strong>Product:</strong> {review.brand}
                                            </Link>
                                        </div>
                                    )}
                                    <div>
                                        <strong>Reviewer: </strong>
                                        @
                                        {review.anonymous ? (
                                            <span>Anonymous</span>
                                        ) : (
                                            <span>{review.user.username}</span>
                                        )}
                                    </div>
                                    <div>
                                        <strong>Date:</strong> {formatDateTime(review.createdAt)}
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-800 text-base leading-relaxed">{review.content}</p>
                        </div>
                    </div>
                    {review.userId === currentUser?.user?.id && (
                        <div className="mt-6 flex justify-end">
                            <DeleteComponent id={id} />
                        </div>
                    )}
                </div>
            )
            }
        </Fragment>
    )
}

export default ReviewPage