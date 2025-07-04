"use client"
import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const SearchBar = ({ searchCategory, setIsMenuOpen, placeholder }: {
    searchCategory: string;
    setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    placeholder: string
}) => {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query !== '') {
            const params = new URLSearchParams(searchParams.toString());
            params.set('q', query);
            params.set('category', searchCategory);
            router.push(`/search?${params.toString()}`);
            // router.push('/search?q=' + query + `&category=${searchCategory}`);
            if (setIsMenuOpen) {
                setIsMenuOpen(false);
            }
            setQuery('')
        }
    };
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setQuery(e.target.value)
    };

    const clearSearchBar = () => {
        setQuery('')
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex text-sm items-center w-auto max-w-xl"
        >
            <input
                type="text"
                value={query}
                onChange={changeHandler}
                placeholder={placeholder}
                className="font-normal text-base w-full pl-10 pr-4 py-2 rounded-l-md rounded-r-none border border-gray-400 border-r-0 hover:border-indigo-600 focus:outline-none"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon className="w-5 h-5" />
            </div>
            {query && (
                <button
                    type="button"
                    onClick={clearSearchBar}
                    className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
            <button type='submit' className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md py-[10px] px-4 border border-indigo-600 hover:border-indigo-700'>Search</button>
        </form>
    );
};

export default SearchBar;
