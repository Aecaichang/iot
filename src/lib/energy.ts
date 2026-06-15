// ข้อมูล IoT ในงานพลังงาน — ตู้ชาร์จ EV, แผงโซลาร์, สมาร์ตมิเตอร์
// ค่าโดยประมาณเพื่อการเรียนรู้

export type EnergyDeviceId = "solar" | "ess" | "ev" | "v2g" | "meter";

export interface EnergyDevice {
  id: EnergyDeviceId;
  name: string;
  emoji: string;
  color: string;
  tagline: string;
  /** โปรโตคอล/มาตรฐานหลักของอุปกรณ์นี้ */
  protocol: string;
  protocolFull: string;
  transport: string;
  howItWorks: string;
  /** สิ่งที่ระบบ IoT อ่าน/สั่งได้ */
  signals: string[];
}

export const ENERGY_DEVICES: EnergyDevice[] = [
  {
    id: "solar",
    name: "แผงโซลาร์เซลล์",
    emoji: "🔆",
    color: "#fbbf24",
    tagline: "ผลิตไฟ DC → แปลงเป็น AC → ส่งเข้าบ้าน/กริด",
    protocol: "Modbus / SunSpec",
    protocolFull: "Modbus RTU/TCP + SunSpec Model",
    transport: "RS-485 / TCP",
    howItWorks:
      "แผงโซลาร์ผลิตไฟกระแสตรง (DC) ส่งให้อินเวอร์เตอร์แปลงเป็นกระแสสลับ (AC) ระบบ IoT อ่านค่าจากอินเวอร์เตอร์ผ่าน Modbus ตามมาตรฐาน SunSpec ที่กำหนดรูปแบบรีจิสเตอร์ให้เหมือนกันทุกยี่ห้อ",
    signals: ["กำลังผลิตปัจจุบัน (kW)", "พลังงานสะสม (kWh)", "แรงดัน/กระแส DC", "อุณหภูมิแผง", "สถานะอินเวอร์เตอร์"],
  },
  {
    id: "ess",
    name: "แบตเตอรี่กักเก็บ (ESS)",
    emoji: "🔋",
    color: "#22d3ee",
    tagline: "เก็บไฟตอนถูก/แดดจัด มาใช้ตอนแพง/ไม่มีแดด",
    protocol: "Modbus / CAN",
    protocolFull: "Modbus TCP + BMS over CAN bus",
    transport: "TCP / CAN",
    howItWorks:
      "ระบบกักเก็บพลังงาน (Energy Storage System) เก็บไฟส่วนเกินจากโซลาร์หรือช่วงค่าไฟถูก แล้วจ่ายคืนตอนต้องการ ระบบ IoT คุยกับ BMS (Battery Management System) เพื่อดูสุขภาพแบตและสั่งชาร์จ/คายประจุตามกลยุทธ์ประหยัดเงิน",
    signals: ["ระดับพลังงานคงเหลือ (SoC %)", "สุขภาพแบต (SoH %)", "อัตราชาร์จ/คายประจุ (kW)", "อุณหภูมิเซลล์", "สั่งชาร์จ/คายประจุระยะไกล"],
  },
  {
    id: "ev",
    name: "ตู้ชาร์จ EV",
    emoji: "🔌",
    color: "#34d399",
    tagline: "คุมการชาร์จรถ + คิดเงิน + รายงานหลังบ้าน",
    protocol: "OCPP",
    protocolFull: "Open Charge Point Protocol (ตัวอย่าง sequence ใช้ OCPP 1.6)",
    transport: "WebSocket (over TCP)",
    howItWorks:
      "ตู้ชาร์จเชื่อมกับระบบหลังบ้าน (CSMS) ผ่าน OCPP บน WebSocket ตัวอย่างในบทเรียนนี้ใช้ข้อความแบบ OCPP 1.6: เริ่มด้วย StartTransaction ส่ง MeterValues ระหว่างชาร์จ และจบด้วย StopTransaction เพื่อคิดค่าไฟ",
    signals: ["เริ่ม/หยุดการชาร์จ", "พลังงานที่จ่าย (kWh)", "สถานะหัวชาร์จ", "Remote Start/Stop", "อัปเดต firmware ระยะไกล"],
  },
  {
    id: "v2g",
    name: "V2G — รถจ่ายไฟคืน",
    emoji: "🔄",
    color: "#f472b6",
    tagline: "ใช้แบตรถ EV เป็นแหล่งพลังงานสำรองให้บ้าน/กริด",
    protocol: "ISO 15118 + OCPP",
    protocolFull: "ISO 15118 (Plug & Charge) + OCPP 2.0.1",
    transport: "PLC ในสายชาร์จ + WebSocket",
    howItWorks:
      "Vehicle-to-Grid ให้รถ EV จ่ายไฟย้อนกลับเข้าบ้านหรือกริดได้ (สองทาง) รถกับตู้ชาร์จเจรจากันผ่าน ISO 15118 ส่วนระบบหลังบ้านสั่งการผ่าน OCPP — ช่วยลดพีคโหลดและทำให้รถกลายเป็นแบตเตอรี่เคลื่อนที่",
    signals: ["ทิศทางพลังงาน (ชาร์จ/จ่ายคืน)", "พลังงานที่จ่ายคืน (kWh)", "ขีดจำกัดที่เจ้าของตั้งไว้", "ราคาไฟ ณ ขณะนั้น", "สั่งสลับโหมดอัตโนมัติ"],
  },
  {
    id: "meter",
    name: "สมาร์ตมิเตอร์",
    emoji: "⚡",
    color: "#a78bfa",
    tagline: "วัดการใช้ไฟ ส่งค่าให้การไฟฟ้า/แอป",
    protocol: "DLMS/COSEM",
    protocolFull: "DLMS/COSEM (IEC 62056)",
    transport: "PLC / Cellular / RF",
    howItWorks:
      "สมาร์ตมิเตอร์วัดการใช้ไฟแบบละเอียดและส่งค่ากลับเข้าระบบ AMI ของการไฟฟ้าอัตโนมัติ ไม่ต้องจดมิเตอร์เอง รองรับการอ่านค่าแบบสองทาง (เช่น บ้านที่มีโซลาร์ขายไฟคืน)",
    signals: ["หน่วยไฟที่ใช้ (kWh)", "กำลังไฟ ณ ขณะนั้น", "ไฟขายคืนกริด", "คุณภาพไฟ (แรงดัน/ความถี่)", "ตัดต่อไฟระยะไกล"],
  },
];

export interface EnergyProtocol {
  name: string;
  full: string;
  usedBy: string;
  note: string;
  color: string;
}

export const ENERGY_PROTOCOLS: EnergyProtocol[] = [
  {
    name: "OCPP",
    full: "Open Charge Point Protocol",
    usedBy: "ตู้ชาร์จ EV ↔ ระบบหลังบ้าน (CSMS)",
    note: "มาตรฐานเปิด ทำให้ตู้ชาร์จต่างยี่ห้อใช้ระบบบริหารเดียวกันได้",
    color: "#34d399",
  },
  {
    name: "Modbus + SunSpec",
    full: "Modbus RTU/TCP + SunSpec",
    usedBy: "อินเวอร์เตอร์โซลาร์, แบตเตอรี่",
    note: "SunSpec กำหนดรูปแบบรีจิสเตอร์ Modbus ให้เป็นมาตรฐานเดียวกัน",
    color: "#fbbf24",
  },
  {
    name: "DLMS/COSEM",
    full: "IEC 62056",
    usedBy: "สมาร์ตมิเตอร์ไฟฟ้า (AMI)",
    note: "มาตรฐานสากลสำหรับอ่านค่ามิเตอร์อัตโนมัติของการไฟฟ้า",
    color: "#a78bfa",
  },
  {
    name: "IEC 61850",
    full: "Power Utility Automation",
    usedBy: "สถานีไฟฟ้า, สมาร์ตกริด",
    note: "ใช้ควบคุม/ป้องกันระบบส่งจ่ายไฟระดับสถานี",
    color: "#38bdf8",
  },
];
