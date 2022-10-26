# leetx: 1337x scraper for Deno

```ts
import fullDetailsSearch from "https://deno.land/x/leetx@v1.0.0/mod.ts";

const search = await fullDetailsSearch("ubuntu iso");
const names = search.map((t) => t.name);
console.log({ names });
```

## What you get from a search

### `getFirstPartialtorrents(searchKeyword: string)`

(Types included in `types/TorrentDetails.ts`)

`getFirstPartialtorrents(searchKeyword: string)` takes a search keyword and returns an array of `FirstPartialTorrent`

```ts
import { getFirstPartialtorrents } from "https://deno.land/x/leetx@v1.0.0/mod.ts";

const res = getFirstPartialtorrents("ubuntu iso");

/* res type (FirstPartialTorrent[]):
{
  name: string;
  seeders: string;
  leechers: string;
  url: string;
  time: string;
  size: string | undefined;
  uploader: string;
  commentCount: string;
}[] */
```

### `getExtraDetails(individualTorrentUrl: string)`

(Types included in `types/TorrentDetails.ts`)

`getExtraDetails(url: string)` takes a torrent url from 1337x (i.e. FirstPartialTorrent[0]["url"]) and returns `ExtraDetails`

```ts
import { getExtraDetails } from "https://deno.land/x/leetx@v1.0.0/mod.ts";

//
const res = getExtraDetails(
  "https://1337x.to/torrent/2091948/Ubuntu-16-10-LTS-Yakkety-Yak-Unity-x32-i386-Desktop-ISO-Uzerus/"
);

/* res type (ExtraDetails[]):
{
  name: string;
  seeders: string;
  leechers: string;
  url: string;
  time: string;
  size: string | undefined;
  uploader: string;
  commentCount: string;
}[] */
```

## Credits

The first 7 or so lines I copied from https://github.com/mikekok/leetx

I also took the name.
