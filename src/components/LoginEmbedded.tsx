"use client";
import { useEffect } from "react";

export default function LoginEmbedded({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onMsg(ev: MessageEvent) {
      try {
        if (
          typeof ev.data === "object" &&
          ev.data &&
          (ev.data as any).__chopin_login === "done"
        ) {
          onClose();
        }
      } catch {}
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "min(720px, 96vw)",
          height: "min(640px, 90vh)",
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "6px 10px",
            background: "#fff",
          }}
        >
          Cerrar
        </button>
        <iframe
          src={src}
          style={{ width: "100%", height: "100%", border: 0 }}
          title="Chopin Login"
        />
      </div>
    </div>
  );
}
