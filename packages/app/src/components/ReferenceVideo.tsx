import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getYouTubeEmbedUrl } from '../lib/youtube';

interface ReferenceVideoProps {
  referenceUrl?: string;
  thumbnailUrl?: string;
  title: string;
}

export function ReferenceVideo({ referenceUrl }: ReferenceVideoProps) {
  const embedUrl = getYouTubeEmbedUrl(referenceUrl);

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
      {embedUrl ? (
        <WebView
          source={{
            uri: embedUrl,
            headers: { Referer: 'https://moajam.app' },
          }}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction
          javaScriptEnabled
          domStorageEnabled
          style={{ flex: 1, backgroundColor: '#182033' }}
        />
      ) : null}
    </View>
  );
}
