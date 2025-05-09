"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const createReview = async (title: string, brand: string, content: string, rating: number, anonymous: boolean) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('tokenkey')
    const tokenValue = token?.value;
    // if (!token){
    //     throw new Error('Please log in to post a review');
    // }
    const response = await fetch(`${process.env.API_URL}/create-review`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenValue}`,
            "Cookie": `tokenkey=${tokenValue}`,
        },
        credentials: 'include',
        body: JSON.stringify({
            title,
            content,
            rating,
            brand,
            anonymous
        })
    })
    if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || 'Failed to post review';
        throw new Error(message || 'Failed to post review');
    }
    // redirect('/');
}

export default createReview