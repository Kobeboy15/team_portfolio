export async function POST(request: Request) {
  const body = await request.json()
  // TODO v2: replace with Resend email to kobemichael15@gmail.com
  console.log('Contact form submission:', body)
  return Response.json({ success: true })
}