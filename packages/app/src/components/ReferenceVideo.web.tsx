import { createElement, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { getYouTubeEmbedUrl } from '../lib/youtube';

interface ReferenceVideoProps {
  referenceUrl?: string;
  thumbnailUrl?: string;
  title: string;
}

export function ReferenceVideo({ referenceUrl, thumbnailUrl, title }: ReferenceVideoProps) {
  const embedUrl = getYouTubeEmbedUrl(referenceUrl);
  const [playing, setPlaying] = useState(false);

  return (
    <View
      style={{
        width: '100%',
        aspectRatio: 16 / 9,
        overflow: 'hidden',
        borderRadius: 12,
        backgroundColor: '#182033',
      }}
    >
      {embedUrl && playing
        ? createElement('iframe', {
            src: `${embedUrl}&autoplay=1`,
            title: `${title} YouTube 레퍼런스`,
            allow:
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
            allowFullScreen: true,
            referrerPolicy: 'strict-origin-when-cross-origin',
            style: { width: '100%', height: '100%', border: 0 },
          })
        : null}
      {!playing ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${title} 레퍼런스 영상 재생`}
          disabled={!embedUrl}
          onPress={() => setPlaying(true)}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              resizeMode="cover"
              style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.75 }}
            />
          ) : null}
          <View
            style={{
              width: 64,
              height: 64,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 32,
              backgroundColor: 'white',
            }}
          >
            <Text style={{ marginLeft: 4, color: '#172033', fontSize: 25 }}>▶</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}
