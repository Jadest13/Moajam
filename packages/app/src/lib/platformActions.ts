import { Share } from 'react-native';
export async function shareLink(path: string) {
  await Share.share({ message: path });
}
export function downloadText(_name: string, text: string, _type = 'text/plain') {
  void _name;
  void _type;
  void Share.share({ message: text });
}
