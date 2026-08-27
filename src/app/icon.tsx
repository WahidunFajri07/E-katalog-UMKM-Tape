import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

export default function Icon() {
  // Membaca file gambar kkm32.PNG
  const imageBuffer = readFileSync(join(process.cwd(), 'public', 'kkm32.PNG'));
  const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <img
          src={base64Image}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // crop bagian tengah (membuang sisa putih di kanan kiri)
            borderRadius: '50%', // buat melingkar sempurna
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
