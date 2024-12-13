import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const generateTokenSetCookies = (userId: any, response: Response) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,
        { expiresIn: "3d" }
    )
    response.cookie("tokenkey", token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
    })
    console.log("cookies: ", response.cookie)
    return token;
}

export default generateTokenSetCookies