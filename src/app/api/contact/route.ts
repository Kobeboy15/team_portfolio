export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return Response.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return Response.json(
      { message: "Name is required." },
      { status: 400 }
    );
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    return Response.json(
      { message: "Email is required." },
      { status: 400 }
    );
  }

  if (!message || typeof message !== "string" || message.trim() === "") {
    return Response.json(
      { message: "Message is required." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return Response.json(
      { message: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (name.trim().length > 100) {
    return Response.json(
      { message: "Name must be 100 characters or fewer." },
      { status: 400 }
    );
  }

  if (message.trim().length > 5000) {
    return Response.json(
      { message: "Message must be 5000 characters or fewer." },
      { status: 400 }
    );
  }

  // TODO v2: replace with Resend email to kobemichael15@gmail.com
  console.log("Contact form submission:", { name, email, message });

  return Response.json({ success: true });
}