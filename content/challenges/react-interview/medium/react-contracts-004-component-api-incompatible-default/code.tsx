import React from "react";

type AvatarProps = {
  src: string;
  size?: number;
};

export function Avatar({ src, size = 0 }: AvatarProps) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
    />
  );
}
