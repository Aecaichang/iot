import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#061414",
          color: "#f4fffb",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 20%, rgba(22, 242, 179, 0.32), transparent 26%), radial-gradient(circle at 82% 22%, rgba(125, 92, 255, 0.26), transparent 24%), linear-gradient(135deg, #071f1d 0%, #081617 48%, #0c182b 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            top: 286,
            display: "flex",
            gap: 36,
            alignItems: "center",
            opacity: 0.9,
          }}
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              style={{
                width: 132,
                height: 132,
                borderRadius: 66,
                border: "2px solid rgba(244, 255, 251, 0.28)",
                background: "rgba(12, 36, 34, 0.88)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 36px rgba(22, 242, 179, 0.22)",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  background: index % 2 === 0 ? "#16f2b3" : "#7d5cff",
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 130,
            right: 130,
            top: 351,
            height: 2,
            background: "rgba(244, 255, 251, 0.34)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#16f2b3",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            IoT Connect
          </div>
          <div
            style={{
              maxWidth: 850,
              fontSize: 68,
              lineHeight: 1.06,
              fontWeight: 800,
            }}
          >
            เรียนรู้มาตรฐานการเชื่อมต่ออุปกรณ์ IoT
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 48,
            fontSize: 30,
            lineHeight: 1.35,
            color: "#cce4dd",
          }}
        >
          <div style={{ maxWidth: 760 }}>
            Wi-Fi · Bluetooth · Zigbee · LoRaWAN · MQTT · Matter · OCPP
          </div>
          <div style={{ color: "#16f2b3", fontWeight: 700 }}>iotlearning.aecaichang.com</div>
        </div>
      </div>
    ),
    size,
  );
}
