// Modules
import { cheerio } from "https://deno.land/x/cheerio@1.0.7/mod.ts";
import { FirstPartialTorrent, TorrentDetails } from "./types/TorrentDetails.ts";
import { ExtraDetails } from "./types/TorrentDetails.ts";
const load = cheerio.load;

// 1337x.to base URL
const leetxURL = "http://1337x.to";

export async function getFirstPartialtorrents(keyword: string) {
  const reqURL = leetxURL + "/search/" + keyword + "/1/";
  const res = await fetch(reqURL);
  const html = await res.text();
  const $ = load(html);

  const firstPartialTorrents = [] as FirstPartialTorrent[];

  $("table.table-list tr").each(function () {
    const torrent: FirstPartialTorrent = {
      name: $(this).find("td:nth-child(1) a:nth-child(2)").text(),
      seeders: $(this).find("td:nth-child(2)").text(),
      leechers: $(this).find("td:nth-child(3)").text(),
      url:
        leetxURL + $(this).find("td:nth-child(1) a:nth-child(2)").attr("href"),
      time: $(this).find("td:nth-child(4)").text(),
      size: $(this).find("td:nth-child(5)").html()?.split("<")?.[0],
      uploader: $(this).find("td:nth-child(6)").text(),
      commentCount: $(this).find("td:nth-child(1) span").text(),
    };
    if (torrent.name) {
      firstPartialTorrents.push(torrent);
    }
  });
  return firstPartialTorrents;
}

export function getResultIdFromUrl(url: string) {
  const regex = /torrent\/(\d+)\//;
  const match = regex.exec(url);
  if (match) {
    return match[1];
  }
  throw new Error("Invalid URL");
}

export async function getComments(url: string) {
  const id = getResultIdFromUrl(url);
  const commentsURL = `${leetxURL}/comments.php?torrentid=${id}`;
  const res = await fetch(commentsURL);
  return (await res.json()) as ExtraDetails["comments"];
}

export async function getExtraDetails(
  torrentURL: string
): Promise<ExtraDetails> {
  const res = await fetch(torrentURL);
  const html = await res.text();
  const $ = load(html);

  const torrentUrls = [] as string[];

  const extraDetails: ExtraDetails = {
    category: $("ul.list > li:nth-child(1) > span").html()?.split("<")?.[0],
    description: $("#description").html()?.trim(),
    torrentUrls,
    magnetUrl: $(".torrent-detail-page > div:nth-child(2) ul > li > a").attr(
      "href"
    ),
    downloadCount: $("ul.list:nth-child(3) > li:nth-child(1) > span").text(),
    comments: await getComments(torrentURL),
  };

  $(".dropdown-menu > li > a").each(function () {
    const href = $(this).attr("href");
    // if not a magnet link, push
    if (href && !href.startsWith("magnet")) {
      torrentUrls.push(href);
    }
  });
  return extraDetails;
}

export default async function fullDetailsSearch(search: string) {
  // get first partial, then get extra details for each result, then merge
  const firstPartialTorrents = await getFirstPartialtorrents(search);
  const urls = firstPartialTorrents.map((t) => t.url);
  const extraDetails = await Promise.all(
    urls.map((url) => getExtraDetails(url))
  );
  const torrents = firstPartialTorrents.map((t, i) => {
    return { ...t, ...extraDetails[i] };
  });
  return torrents as TorrentDetails[];
}
