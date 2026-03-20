export function getSafeAuthRedirectPath(nextPath?: string | null) {
  const normalized = (nextPath ?? "").trim();

  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return "/dashboard";
  }

  if (normalized === "/sign-in" || normalized === "/sign-up") {
    return "/dashboard";
  }

  return normalized || "/dashboard";
}
