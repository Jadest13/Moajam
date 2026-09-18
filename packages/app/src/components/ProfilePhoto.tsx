import { Image } from 'react-native';
import { Input } from '../styles/layout';
export function ProfilePhoto({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <>
      {value ? (
        <Image source={{ uri: value }} style={{ width: 64, height: 64, borderRadius: 32 }} />
      ) : null}
      <Input value={value} onChangeText={onChange} placeholder="프로필 사진 URL" />
    </>
  );
}
