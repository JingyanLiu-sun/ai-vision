"use client";
import React, { useEffect, useState } from 'react';

const ResponsiveWebPImage = React.memo(({ src, alt }) => {
  const [resolvedSrc, setResolvedSrc] = useState(src);
  useEffect(() => setResolvedSrc(src), [src]);
  return (
    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
      <img
        src={resolvedSrc}
        alt={alt}
        loading="lazy"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        onError={() => setResolvedSrc('/logo512.png')}
      />
    </div>
  );
});

ResponsiveWebPImage.displayName = 'ResponsiveWebPImage';

export default ResponsiveWebPImage;
