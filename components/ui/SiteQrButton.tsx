"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function SiteQrButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    setSiteUrl(window.location.origin);
  }, []);

  const qrUrl = siteUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(siteUrl)}`
    : "";

  return (
    <>
      <Button type="button" variant="secondary" className="qr-trigger-button" onClick={() => setIsOpen(true)}>
        顯示 QR code
      </Button>

      {isOpen ? (
        <div className="qr-modal-backdrop" role="presentation" onClick={() => setIsOpen(false)}>
          <div
            className="qr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="qr-modal-header">
              <h2 id="qr-modal-title">網站 QR code</h2>
              <button className="qr-close-button" type="button" aria-label="關閉 QR code" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>
            {qrUrl ? <img className="qr-image" src={qrUrl} alt={`${siteUrl} 的 QR code`} /> : null}
            <p className="qr-url">{siteUrl}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
