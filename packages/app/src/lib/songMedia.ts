const youtubeThumbnail = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
const youtubeVideo = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

export const songMedia = {
  creep: {
    youtubeUrl: youtubeVideo('9RfVp-GhKfs'),
    thumbnailUrl: youtubeThumbnail('9RfVp-GhKfs'),
  },
  'teen-spirit': {
    youtubeUrl: youtubeVideo('ljUtuoFt-8c'),
    thumbnailUrl: youtubeThumbnail('ljUtuoFt-8c'),
  },
  'dont-look-back': {
    youtubeUrl: youtubeVideo('X59TlszGtfM'),
    thumbnailUrl: youtubeThumbnail('X59TlszGtfM'),
  },
} as const;

const aliases: Record<string, keyof typeof songMedia> = {
  creep: 'creep',
  oasis: 'dont-look-back',
  nirvana: 'teen-spirit',
  'dont-look-back': 'dont-look-back',
  'teen-spirit': 'teen-spirit',
};

export function getSongThumbnail(id: string) {
  const mediaId = aliases[id];
  return mediaId ? songMedia[mediaId].thumbnailUrl : undefined;
}
