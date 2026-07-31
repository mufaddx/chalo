import AgencyProfilePage, { generateMetadata as agencyProfileMetadata } from "@/app/(site)/agencies/[slug]/page";

// A short vanity URL for agency profiles — voyagr.in/{slug} in addition to
// the existing /agencies/{slug}. Next.js always resolves a literal route
// segment (e.g. /login, /agencies, /search) before falling back to this
// dynamic one, so this can never shadow any of the app's other top-level
// pages — it only ever catches a path nothing else claimed.
export default AgencyProfilePage;

export const generateMetadata = agencyProfileMetadata;
