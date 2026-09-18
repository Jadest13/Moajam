import { useState } from 'react';
import { Meta } from './ProductUI';
export function ProfilePhoto({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [error, setError] = useState('');
  return (
    <>
      {value ? (
        <img
          src={value}
          alt="내 프로필"
          style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover' }}
        />
      ) : null}
      <input
        aria-label="프로필 사진 변경"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (file.size > 500 * 1024) {
            setError('500KB 이하의 사진을 선택해주세요.');
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            onChange(String(reader.result));
            setError('');
          };
          reader.onerror = () => setError('사진을 읽지 못했어요.');
          reader.readAsDataURL(file);
        }}
      />
      {error ? <Meta>{error}</Meta> : null}
    </>
  );
}
