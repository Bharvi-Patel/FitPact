import {connectDB} from "@/lib/mongodb"
import {NextResponse} from "next/server"

export async function  GET() {
    try{
        await connectDB()
        return NextResponse.json({message: "Database connection successful"})
    } catch (error) {
        return NextResponse.json({message: "Database connection failed", details : error.message}, {status: 500})
    }
}