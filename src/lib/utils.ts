import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/****************
 * VIDEO UTILS
 ****************/

/**
 *  ProcessVimeoEmbedCode
 * 
 * @param string videoEmbedCode - The vimeo embed code for the video
 * @returns { 
 *  baseUrl:  Beginning the vimeo url, 
 *  videoId:  Vimeo video id, 
 *  hash:     string used by vimeo to manage privacy settings, 
 *  title:    Title of the video
 * }
 */
export function processVimeoEmbedCode(videoEmbedCode: string): {
  baseUrl: string | null;
  videoId: string | null;
  hash: string | null;
  title: string | null;
} {
  const srcMatch = videoEmbedCode.match(/src="([^"]+)"/);
  const titleMatch = videoEmbedCode.match(/title="([^"]+)"/);

  const src = srcMatch?.[1] ?? null;
  const title = titleMatch?.[1] ?? null;

  let baseUrl: string | null = null;
  let videoId: string | null = null;
  let hash: string | null = null;

  if (src) {
    const url = new URL(src.replace(/&amp;/g, "&"));

    // Match /video/{id} optionally followed by /{hash}
    const pathMatch = url.pathname.match(/\/video\/(\d+)\/?([a-f0-9]+)?/);
    videoId = pathMatch?.[1] ?? null;
    baseUrl = videoId ? `${url.origin}/video/${videoId}` : null;

    // Hash can be a path segment or the "h" query param
    hash = pathMatch?.[2] ?? url.searchParams.get("h");

    console.log( { baseUrl, videoId, hash, title } );
  }

  return { baseUrl, videoId, hash, title };
}