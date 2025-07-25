import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/sign-up";

  const { data: { user } } = await supabase.auth.getUser();

  if (isAuthRoute && user) {
    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_BASE_URL!)
    );
  }

  const { searchParams, pathname } = new URL(request.url);

  if (!searchParams.get("noteId") && pathname === "/" && user) {
    // Fetch newest note ID
    const { newestNoteId } = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note?userId=${user.id}`
    ).then((res) => res.json());

    if (newestNoteId) {
      const url = request.nextUrl.clone();
      url.searchParams.set("noteId", newestNoteId);
      return NextResponse.redirect(url);
    }

    // Create new note
    const { noteId } = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());

    const url = request.nextUrl.clone();
    url.searchParams.set("noteId", noteId);
    return NextResponse.redirect(url);
  }

  return response;
}
