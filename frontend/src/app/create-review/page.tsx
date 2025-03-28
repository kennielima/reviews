"use client"
import React, { FormEvent, useState } from 'react';
import createReview from '../hooks/useCreateReview';
import { RenderStars } from '@/components/renderStars';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const CreateReviewForm = () => {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!brand.trim()) {
      setError('Please enter a brand name');
      return;
    }
    if (!content.trim()) {
      setError('Please write your review');
      return;
    }
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    try {
      await createReview(
        capitalizeFirstLetter(title),
        capitalizeFirstLetter(brand),
        content,
        rating,
        anonymous
      );
      setTitle('');
      setBrand('');
      setContent('');
      setRating(0);
      setError('');
      setAnonymous(false)
      router.push('/')
    } catch (error) {
      setError('Error posting review')
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 my-12 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Write a Review</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Summarize your review"
            maxLength={100}
          />
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            Product/Brand Name
          </label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name of brand, product or company"
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Review Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your experience"
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex space-x-1">
            <RenderStars rating={rating} setRating={setRating} size='w-8 h-8' />
          </div>
        </div>
        <label className='flex items-center gap-2'>
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
          />
          Post as anonymous
        </label>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default CreateReviewForm;