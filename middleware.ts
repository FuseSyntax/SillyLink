// middleware.ts
import { auth } from "@/auth";

export default auth();

export const config = {
  matcher: ["/analytics/:path*"],
};
