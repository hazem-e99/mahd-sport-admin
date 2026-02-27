export const safeHtmlParser = (html: string | undefined | null): string => {
  if (!html) return "";

  // Remove script tags and their content
  const withoutScripts = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Remove event handlers (onclick, onload, etc.)
  const withoutEvents = withoutScripts.replace(/\s(on\w+)="[^"]*"/gi, "");

  // Remove javascript: URLs
  const withoutJsUrls = withoutEvents.replace(/javascript:[^"']*/gi, "");

  return withoutJsUrls;
};
