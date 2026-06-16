"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/common/Card";

/**
 * อธิบายรูปแบบ Publish/Subscribe ของ MQTT
 * Publisher (เซนเซอร์) -> Broker (ตัวกลาง) -> Subscribers (ผู้รับ)
 */
const W = 760;
const H = 360;

const PUBLISHER = { x: 90, y: 180 };
const BROKER = { x: 380, y: 180 };
const SUBS = [
  { x: 660, y: 80, label: "📱", name: "แอปมือถือ" },
  { x: 660, y: 180, label: "💾", name: "ฐานข้อมูล" },
  { x: 660, y: 280, label: "🚨", name: "ระบบแจ้งเตือน" },
];

const MQTT_FACTS = [
  {
    title: "Client / Server",
    detail:
      "อุปกรณ์ทุกตัวเป็น Client ที่เชื่อมไปหา Broker ไม่ต้องเปิด port ให้ device คุยกันเองโดยตรง",
  },
  {
    title: "Publish / Subscribe",
    detail:
      "Publisher ส่งข้อความเข้า topic ส่วน Subscriber เลือกสมัครรับ topic ที่สนใจ ทำให้ระบบแยกส่วนกันได้ดี",
  },
  {
    title: "Topic Filter",
    detail:
      "topic มักจัดเป็นลำดับชั้น เช่น building/room-01/temperature และใช้ wildcard เพื่อรับข้อมูลหลายจุดพร้อมกัน",
  },
  {
    title: "Payload Agnostic",
    detail:
      "MQTT ไม่บังคับรูปแบบ payload จะส่ง JSON, binary หรือ protobuf ก็ได้ ข้อตกลง schema จึงอยู่ที่ระบบของเรา",
  },
] as const;

const QOS_LEVELS = [
  {
    level: "QoS 0",
    name: "At most once",
    useCase: "ข้อมูลเซนเซอร์ที่ส่งถี่และยอมเสียบางค่าได้",
    flow: "PUBLISH",
  },
  {
    level: "QoS 1",
    name: "At least once",
    useCase: "event สำคัญที่รับซ้ำได้ เช่น alert หรือสถานะเครื่อง",
    flow: "PUBLISH -> PUBACK",
  },
  {
    level: "QoS 2",
    name: "Exactly once",
    useCase: "ธุรกรรมที่ซ้ำไม่ได้ เช่น billing หรือคำสั่งสำคัญ",
    flow: "PUBLISH -> PUBREC -> PUBREL -> PUBCOMP",
  },
] as const;

const MQTT_V5_FEATURES = [
  {
    title: "Session Expiry",
    detail:
      "กำหนดได้ว่า Broker จะเก็บ session หลังหลุดนานแค่ไหน เพื่อให้ device reconnect แล้วรับงานค้างต่อได้",
  },
  {
    title: "Retained Message",
    detail:
      "Broker เก็บข้อความล่าสุดของ topic ไว้ให้ subscriber ใหม่เห็นสถานะปัจจุบันทันที เช่น online/offline หรือค่าล่าสุด",
  },
  {
    title: "Message Expiry",
    detail:
      "ข้อความมีอายุได้ ถ้าส่งไม่ทันในเวลาที่กำหนดก็ไม่ควร deliver ต่อ เพราะข้อมูล IoT บางชนิดหมดความหมายเร็ว",
  },
  {
    title: "Reason Codes",
    detail:
      "packet ตอบกลับบอกผลสำเร็จ/ล้มเหลวได้ชัดขึ้น เช่น QoS ไม่รองรับ, packet ใหญ่เกิน หรือ auth ไม่ผ่าน",
  },
  {
    title: "Topic Alias",
    detail:
      "ลด overhead โดยแทนชื่อ topic ยาว ๆ ด้วยเลข alias ระหว่าง connection เหมาะกับเครือข่ายที่ bandwidth จำกัด",
  },
  {
    title: "Shared Subscription",
    detail:
      "ใช้รูปแบบ $share/{group}/{filter} เพื่อกระจายงานจาก topic เดียวไปยัง worker หลายตัวแบบ load balancing",
  },
] as const;

export function MqttFlow() {
  return (
    <Card accent="var(--color-cyan)" className="space-y-7">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-cyan)]">
                MQTT: ภาษาหลักของ IoT ที่ใช้ Broker เป็นตัวกลาง
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-soft)]">
                MQTT v5.0 เป็นโปรโตคอลแบบ Client-Server Publish/Subscribe ที่ออกแบบให้เบา ใช้งานง่าย
                และเหมาะกับอุปกรณ์ M2M/IoT ที่ bandwidth หรือทรัพยากรจำกัด
              </p>
            </div>
            <a
              className="mono rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-soft)] transition-colors hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)]"
              href="https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html"
              target="_blank"
              rel="noreferrer"
            >
              OASIS MQTT v5.0
            </a>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)]/60 p-3 sm:p-4">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full min-w-[640px]"
              role="img"
              aria-label="แผนภาพการทำงานของ MQTT แบบ publish subscribe"
            >
              <line
                x1={PUBLISHER.x + 36}
                y1={PUBLISHER.y}
                x2={BROKER.x - 50}
                y2={BROKER.y}
                stroke="var(--color-border)"
                strokeWidth="1.5"
              />
              <motion.circle
                r="6"
                fill="var(--color-cyan)"
                cy={PUBLISHER.y}
                animate={{ cx: [PUBLISHER.x + 36, BROKER.x - 50], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ filter: "drop-shadow(0 0 6px var(--color-cyan))" }}
              />
              <text
                x={(PUBLISHER.x + BROKER.x) / 2 - 10}
                y={PUBLISHER.y - 14}
                textAnchor="middle"
                fontSize="12"
                fill="var(--color-cyan)"
              >
                publish - topic: building/room-01/temp
              </text>

              {SUBS.map((s, i) => (
                <g key={i}>
                  <line
                    x1={BROKER.x + 50}
                    y1={BROKER.y}
                    x2={s.x - 36}
                    y2={s.y}
                    stroke="var(--color-border)"
                    strokeWidth="1.5"
                  />
                  <motion.circle
                    r="6"
                    fill="var(--color-violet)"
                    animate={{
                      cx: [BROKER.x + 50, s.x - 36],
                      cy: [BROKER.y, s.y],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatDelay: 0.6,
                      delay: 1.4 + i * 0.12,
                      ease: "easeInOut",
                    }}
                    style={{ filter: "drop-shadow(0 0 6px var(--color-violet))" }}
                  />
                </g>
              ))}

              <Node x={PUBLISHER.x} y={PUBLISHER.y} emoji="🌡️" sub="เซนเซอร์" color="var(--color-cyan)" />

              <g>
                <motion.rect
                  x={BROKER.x - 50}
                  y={BROKER.y - 50}
                  width="100"
                  height="100"
                  rx="16"
                  fill="var(--color-surface-2)"
                  stroke="var(--color-text)"
                  strokeWidth="2"
                  animate={{ strokeOpacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <text x={BROKER.x} y={BROKER.y - 6} textAnchor="middle" fontSize="30">
                  🏤
                </text>
                <text
                  x={BROKER.x}
                  y={BROKER.y + 28}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill="var(--color-text)"
                >
                  Broker
                </text>
              </g>

              {SUBS.map((s, i) => (
                <Node key={i} x={s.x} y={s.y} emoji={s.label} sub={s.name} color="var(--color-violet)" />
              ))}
            </svg>

            <p className="mono mt-3 text-center text-xs text-[var(--color-text-dim)]">
              เซนเซอร์ส่งครั้งเดียวไปที่ Broker - ใคร subscribe topic นั้นก็ได้รับข้อมูลตามเงื่อนไข QoS
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[#0b1020] p-4">
          <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
            <span>MQTT publish packet</span>
            <span>QoS 1</span>
          </div>
          <pre className="mono mt-3 overflow-x-auto text-xs leading-6 text-[var(--color-green)]">{`topic: building/room-01/temperature
retain: false
qos: 1
payload:
{
  "deviceId": "room-01",
  "temperature": 31.8,
  "unit": "celsius",
  "ts": "2026-06-16T10:42:08+07:00"
}`}</pre>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MQTT_FACTS.map((item) => (
          <InfoPanel key={item.title} title={item.title} detail={item.detail} />
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h4 className="font-semibold text-[var(--color-text)]">QoS เลือกระดับการรับประกันข้อความ</h4>
            <p className="text-sm text-[var(--color-text-dim)]">
              ยิ่ง QoS สูง ยิ่งมี acknowledgement มากขึ้น แลกกับ traffic และ latency ที่เพิ่มขึ้น
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {QOS_LEVELS.map((item) => (
            <div key={item.level} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/35 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h5 className="font-semibold text-[var(--color-cyan)]">{item.level}</h5>
                <span className="mono text-[10px] text-[var(--color-text-dim)]">{item.name}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-text-soft)]">{item.useCase}</p>
              <p className="mono mt-3 overflow-x-auto rounded-lg bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-text-dim)]">
                {item.flow}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-[var(--color-text)]">ฟีเจอร์ MQTT v5 ที่เจอบ่อยในระบบจริง</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MQTT_V5_FEATURES.map((item) => (
            <InfoPanel key={item.title} title={item.title} detail={item.detail} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function InfoPanel({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/35 p-4">
      <h5 className="font-semibold text-[var(--color-text)]">{title}</h5>
      <p className="mt-2 text-sm text-[var(--color-text-soft)]">{detail}</p>
    </div>
  );
}

function Node({
  x,
  y,
  emoji,
  sub,
  color,
}: {
  x: number;
  y: number;
  emoji: string;
  sub: string;
  color: string;
}) {
  return (
    <g>
      <rect x={x - 36} y={y - 36} width="72" height="72" rx="14" fill="var(--color-surface)" stroke={color} strokeWidth="1.5" />
      <text x={x} y={y + 6} textAnchor="middle" fontSize="28">
        {emoji}
      </text>
      <text x={x} y={y + 52} textAnchor="middle" fontSize="11" fontWeight="600" fill={color}>
        {sub}
      </text>
    </g>
  );
}
