"use client"
import React, { FormEvent, useEffect, useState, useRef } from 'react';
import createReview from '@/app/services/useCreateReview';
import { RenderStars } from '@/components/renderStars';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Product, User } from '@/lib/types';
import { Check, Loader, Send, UserRoundPen, X } from 'lucide-react';
import Modal from '@/components/Modal';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FileUploadWithPreview } from 'file-upload-with-preview';
import 'file-upload-with-preview/dist/style.css';
import { useRouter } from 'next/navigation';

type CreateReviewTypeProps = {
    brands: Product[];
    user: {
        loggedIn: boolean;
        user: User
    }
}

const CreateReviewForm: React.FC<CreateReviewTypeProps> = ({ brands, user }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const brandId = searchParams.get('brand');

    const paramBrand = brands?.find((brand: Product) => brand.id === brandId);

    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState(paramBrand?.name || '');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const [anonymous, setAnonymous] = useState<boolean>(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const uploadRef = useRef<FileUploadWithPreview | null>(null);


    const handleChangeBrandName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrand(e.target.value);
        const filtered = brands?.filter(brand => brand.name.toLowerCase().includes(e.target.value.toLowerCase())) || [];

        setFilteredSuggestions(filtered);
        setShowSuggestions(true);
    };

    const handleSelectBrandName = (suggestion: Product) => {
        setBrand(suggestion.name);
        setShowSuggestions(false);
    };

    useEffect(() => {
        const container = document.querySelector('[data-upload-id="image_id"]');
        if (container) {
            container.innerHTML = '';
        }
        if (!uploadRef.current) {
            const upload = new FileUploadWithPreview('image_id', {
                text: {
                    chooseFile: 'Click here to select images',
                    browse: 'Browse',
                    selectedCount: 'Selected Images',
                    label: 'Upload images for your review (max 10)'
                },
                multiple: true,
                maxFileCount: 10,
                accept: 'image/*, .png, .jpg, .webp, .jpeg',
            });
            uploadRef.current = upload;
            setImages(upload.cachedFileArray);
        }
        return () => {
            const container = document.querySelector('[data-upload-id="image_id"]');
            if (container) {
                container.innerHTML = '';
            }
            uploadRef.current = null;
        };
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) { setError('Please enter a title'); return; };
        if (title.length < 10) { setError('Title must be at least 10 characters long'); return; }
        if (!brand.trim()) { setError('Please enter a brand name'); return; }
        if (!content.trim()) { setError('Please write your review'); return; }
        if (content.length < 60) { setError('Review must be at least 60 characters long'); return; }
        if (rating === 0) { setError('Please select a rating'); return; }
        // if (images.length > 10) { setError('You can not select more than 10 pictures!'); return; }
        setIsLoading(true);

        try {
            if (!user.loggedIn) setIsOpen(true);
            const res = await createReview(
                capitalizeFirstLetter(title.trimEnd().trimStart()),
                capitalizeFirstLetter(brand.trimEnd().trimStart()),
                content.trimEnd().trimStart(),
                rating,
                anonymous,
                images
            );
            if (res?.error) {
                setError(res.error);
                return;
            } else {
                setIsOpen(true);
                setTitle('');
                setBrand('');
                setContent('');
                setRating(0);
                setError('');
                setAnonymous(false)
                setImages([])
                uploadRef.current?.resetPreviewPanel();
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Unknown error:', error);
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError(error as string);
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="md:my-10 max-w-2xl mx-auto p-10 md:p-8 bg-indigo-50 shadow-md rounded-xl border">
            <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserRoundPen className="h-8 w-8 text-indigo-600" />
                </div>
            </div>
            <div className='flex flex-col mb-8 text-center gap-1'>
                <h2 className="text-2xl font-bold">Write a Review</h2>
                <p className='font-medium text-gray-700'>Share your experience and help others make better decisions</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold mb-2">
                        Review Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); setError('') }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Summarize your review"
                        maxLength={100}
                    />
                    {(error === 'Please enter a title' && title === '') && (
                        <div className="text-red-700 text-xs mt-1">{error}</div>
                    )}
                    {(error === 'Title must be at least 10 characters long') && (
                        <div className="text-red-700 text-xs mt-1">{error}</div>
                    )}
                </div>
                <div>
                    <label htmlFor="brand" className="block text-sm font-semibold mb-2">
                        Product/Brand Name
                    </label>
                    <div className="relative w-full" onMouseLeave={() => setShowSuggestions(false)}>
                        <input
                            type="text"
                            id="brand"
                            value={brand}
                            onChange={handleChangeBrandName}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Name of brand, product or company"
                            maxLength={50}
                        />
                        {showSuggestions && (
                            <ul className="absolute z-10 w-full bg-white border rounded mt-[1px] max-h-40 overflow-auto shadow">
                                {filteredSuggestions.length > 0 && (
                                    filteredSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSelectBrandName(suggestion)}
                                        >
                                            {suggestion.name}
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                        {(error === 'Please enter a brand name' && brand === '') && (
                            <div className="text-red-700 text-xs mt-1">{error}</div>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-semibold mb-2">
                        Review Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            setError('');
                        }}
                        rows={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Tell us about your experience..."
                    />
                    {(error === 'Please write your review' && content === '') && (
                        <div className="text-red-700 text-xs mt-1">{error}</div>
                    )}
                    {(error === 'Review must be at least 60 characters long') && (
                        <div className="text-red-700 text-xs mt-1">{error}</div>
                    )}
                </div>
                {/* image uploader */}
                <div className="custom-file-container" data-upload-id="image_id"></div>

                {/* {(error === 'You can not select more than 10 pictures!') && (
                    <div className="text-red-700 text-xs mt-1">{error}</div>
                )} */}

                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Rating
                    </label>
                    <div className="flex space-x-1">
                        <RenderStars rating={rating} setRating={setRating} size='w-8 h-8' />
                    </div>
                    {(error === 'Please select a rating' && rating === 0) && (
                        <div className="text-red-700 text-xs mt-1">{error}</div>
                    )}
                </div>
                <label className='flex items-center gap-2 font-semibold text-sm'>
                    <input
                        type="checkbox"
                        id="anon"
                        name="anon"
                        checked={anonymous}
                        onChange={() => setAnonymous(!anonymous)}
                        className='size-5'
                    />
                    Post as anonymous
                </label>

                <button
                    type="submit"
                    className="w-full py-2 font-semibold flex items-center justify-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    {isLoading ? (
                        <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            <span>Submitting</span>
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            <span>Submit Review</span>
                        </>
                    )}


                </button>
                {(error === 'You cannot review a product twice') && (
                    <div className="text-red-700 text-sm mt-1">Sorry, {error}!
                        <Link href='/faq?index=5' className='text-indigo-600 hover:text-indigo-500 font-bold'> Find out why</Link>
                    </div>
                )}
            </form>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                {
                    <div>
                        <div
                            className='flex w-full justify-end text-gray-600 cursor-pointer mb-6'
                            onClick={() => setIsOpen(false)}
                        >
                            <X />
                        </div>
                        {(!user || !user.loggedIn) ? (
                            <div className='flex flex-col w-full font-bold  items-center text-center gap-2'>
                                <div>Sorry, you must be logged in to create a review</div>
                                <Link href='/auth'>
                                    <button
                                        className='bg-indigo-600 mx-auto my-2 hover:bg-indigo-700 w-fit rounded-md text-white px-4 py-2'
                                    >
                                        Login
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className='flex flex-col w-full items-center text-center'>
                                <div className='rounded-full bg-[#36b400] w-fit p-6 text-white'>
                                    <Check className='size-8' />
                                </div>
                                <p className="mt-8 mb-2 text-lg font-semibold">You have successfully created a review!</p>
                                <p className='text-xs text-gray-600 mx-3 mb-2'>Thank you. Posting reviews would help others make better informed decisions about this brand</p>
                                <Link href='/'>
                                    <button
                                        className='bg-indigo-600 mx-auto my-2 hover:bg-indigo-700 w-fit rounded-md text-white px-4 py-2'
                                        onClick={() => {
                                            router.push('/')
                                        }}>
                                        Back to Home
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                }
            </Modal>
        </div>
    );
};

export default CreateReviewForm;