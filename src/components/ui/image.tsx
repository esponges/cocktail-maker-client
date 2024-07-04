import { IKImage } from "imagekitio-react";

type Props = {
  path: string;
  alt?: string;
  className?: string;
};

export function Image({ alt, path, className }: Props) {
  return (
    <IKImage
      className={className}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL}
      path={path}
      alt={alt}
    />
  );
}
