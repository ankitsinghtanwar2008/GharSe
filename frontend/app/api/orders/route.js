import { NextResponse } from "next/server";

export async function POST(req) {

try {

const body = await req.json();

console.log("New Order:", body);

return NextResponse.json({
success:true,
message:"Order created successfully"
});

} catch(error){

return NextResponse.json({
success:false,
message:"Order failed"
},{status:500})

}

}