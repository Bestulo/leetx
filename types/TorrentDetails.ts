export type FirstPartialTorrent = {
  name: string;
  seeders: string;
  leechers: string;
  url: string;
  time: string;
  size: string | undefined;
  uploader: string;
  commentCount: string;
};

export type ExtraDetails = {
  // everything not included in FirstPartialTorrent
  category: string | undefined;
  description: string | undefined;
  torrentUrls: (string | undefined)[];
  magnetUrl: string | undefined;
  downloadCount: string | undefined;
  comments: {
    commentid: string | undefined;
    comment: string | undefined;
    username: string | undefined;
    avatar: string | undefined;
    class: string | undefined;
    posted: string | undefined;
  }[];
};

export type TorrentDetails = FirstPartialTorrent & ExtraDetails;
