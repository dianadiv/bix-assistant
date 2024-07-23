import { bottts } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import Image from 'next/image';

export default function Avatar() {
  const avatar = createAvatar(bottts, {
    seed: 'Dusty',
    radius: 30,
    backgroundColor: ["2239c9"]
  });
  const svg = avatar.toString();
  const avatarUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

  return (
    <Image alt='Logo Image' src={avatarUrl} width={100} height={100}/>
  )
}
