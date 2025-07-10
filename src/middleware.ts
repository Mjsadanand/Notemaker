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
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    }
  );

  const { pathname, searchParams } = new URL(request.url);
  const isAuthRoute = pathname === "/login" || pathname === "/sign-up";

  // Check if a session exists before calling getUser()
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If session exists, then fetch the user safely
  let user = null;
  if (session) {
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
  }

  // Redirect non-authenticated users to login page (except for auth routes)
  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL));
  }

  // If on home page without a noteId, redirect to newest or create one
  if (!searchParams.get("noteId") && pathname === "/" && user) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    try {
      const { newestNoteId } = await fetch(
        `${baseUrl}/api/fetch-newest-note?userId=${user.id}`,
      ).then((res) => res.json());

      if (newestNoteId) {
        const url = request.nextUrl.clone();
        url.searchParams.set("noteId", newestNoteId);
        return NextResponse.redirect(url);
      } else {
        const { noteId } = await fetch(
          `${baseUrl}/api/create-new-note?userId=${user.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        ).then((res) => res.json());

        const url = request.nextUrl.clone();
        url.searchParams.set("noteId", noteId);
        return NextResponse.redirect(url);
      }
    } catch (err) {
      console.error("Middleware note fetch/create failed:", err);
      // If API calls fail, still allow the request to continue
      // This prevents infinite redirects if the database is down
    }
  }

  return supabaseResponse;
}
