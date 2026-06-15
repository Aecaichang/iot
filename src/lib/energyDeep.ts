// ข้อมูลเชิงลึก IoT พลังงาน — โซลาร์รายวัน, ชนิดการชาร์จ EV, OCPP, peak shaving
// ค่าตัวเลขเป็นค่าโดยประมาณเพื่อการเรียนรู้

/* ─────────────────────────────────────────────
   1) หนึ่งวันของบ้านโซลาร์ + แบตเตอรี่
   ───────────────────────────────────────────── */

export interface SolarHour {
  hour: number; // 0–23
  solarKw: number; // กำลังผลิตจากโซลาร์
  loadKw: number; // กำลังที่บ้านใช้
  socPct: number; // แบตคงเหลือ % หลังจบชั่วโมงนั้น
  batteryKw: number; // + = ชาร์จเข้าแบต, − = แบตจ่ายออก
  gridKw: number; // + = ดึงจากกริด, − = ขายคืนกริด
}

const SOLAR_PROFILE = [
  0, 0, 0, 0, 0, 0, 0.3, 1.0, 2.2, 3.4, 4.3, 4.8, 5.0, 4.8, 4.2, 3.3, 2.1, 1.0,
  0.3, 0, 0, 0, 0, 0,
];

const LOAD_PROFILE = [
  0.4, 0.3, 0.3, 0.3, 0.3, 0.4, 0.8, 1.2, 1.0, 0.7, 0.6, 0.7, 1.0, 0.8, 0.6,
  0.6, 0.8, 1.3, 2.2, 2.6, 2.4, 1.8, 1.0, 0.6,
];

const BATTERY_KWH = 10; // ความจุใช้งานได้
const SOC_MIN = 20; // สำรองขั้นต่ำ %
const MAX_BATTERY_KW = 3; // อัตราชาร์จ/คายสูงสุด

/** คำนวณการไหลของพลังงานตลอดวัน (deterministic) */
export function computeSolarDay(startSocPct = 35): SolarHour[] {
  let soc = startSocPct;
  const result: SolarHour[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const solarKw = SOLAR_PROFILE[hour];
    const loadKw = LOAD_PROFILE[hour];
    const net = solarKw - loadKw; // บวก = เหลือ, ลบ = ขาด

    let batteryKw = 0;
    let gridKw = 0;

    if (net >= 0) {
      // ไฟเหลือ → ชาร์จแบตก่อน เหลือค่อยขายกริด
      const headroomKwh = ((100 - soc) / 100) * BATTERY_KWH;
      const charge = Math.min(net, MAX_BATTERY_KW, headroomKwh);
      batteryKw = charge;
      gridKw = -(net - charge); // ที่เหลือขายคืน (ค่าลบ)
      soc += (charge / BATTERY_KWH) * 100;
    } else {
      // ไฟขาด → ใช้แบตก่อน เหลือค่อยดึงจากกริด
      const need = -net;
      const availableKwh = ((soc - SOC_MIN) / 100) * BATTERY_KWH;
      const discharge = Math.min(need, MAX_BATTERY_KW, Math.max(0, availableKwh));
      batteryKw = -discharge;
      gridKw = need - discharge; // ที่เหลือดึงจากกริด (ค่าบวก)
      soc -= (discharge / BATTERY_KWH) * 100;
    }

    result.push({
      hour,
      solarKw: round(solarKw),
      loadKw: round(loadKw),
      socPct: Math.round(soc),
      batteryKw: round(batteryKw),
      gridKw: round(gridKw),
    });
  }
  return result;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/* ─────────────────────────────────────────────
   2) ชนิดการชาร์จ EV — AC vs DC
   ───────────────────────────────────────────── */

export interface ChargeMode {
  id: string;
  name: string;
  kind: "AC" | "DC";
  kW: number;
  powerLabel: string;
  connector: string;
  /** ชาร์จ 0→80% ของแบต 60 kWh ใช้เวลาประมาณ */
  timeTo80: string;
  rangePerHour: string;
  where: string;
  color: string;
}

export const CHARGE_MODES: ChargeMode[] = [
  {
    id: "ac-home",
    name: "AC ชาร์จที่บ้าน",
    kind: "AC",
    kW: 7.4,
    powerLabel: "3.7–7.4 kW",
    connector: "Type 2 (1 เฟส)",
    timeTo80: "~7 ชม.",
    rangePerHour: "+40 กม./ชม.",
    where: "บ้าน, ที่จอดรถคอนโด",
    color: "#34d399",
  },
  {
    id: "ac-dest",
    name: "AC สาธารณะ 3 เฟส",
    kind: "AC",
    kW: 22,
    powerLabel: "11–22 kW",
    connector: "Type 2 (3 เฟส)",
    timeTo80: "~2.5 ชม.",
    rangePerHour: "+120 กม./ชม.",
    where: "ห้าง, โรงแรม, ออฟฟิศ",
    color: "#22d3ee",
  },
  {
    id: "dc-fast",
    name: "DC Fast Charge",
    kind: "DC",
    kW: 50,
    powerLabel: "50–60 kW",
    connector: "CCS2 / CHAdeMO",
    timeTo80: "~50 นาที",
    rangePerHour: "+250 กม./30 นาที",
    where: "ปั๊ม, จุดพักริมทาง",
    color: "#fbbf24",
  },
  {
    id: "dc-ultra",
    name: "DC Ultra-Fast",
    kind: "DC",
    kW: 350,
    powerLabel: "150–350 kW",
    connector: "CCS2 (HPC)",
    timeTo80: "~18 นาที",
    rangePerHour: "+100 กม./5 นาที",
    where: "สถานีบนไฮเวย์",
    color: "#f472b6",
  },
];

/* ─────────────────────────────────────────────
   3) OCPP — ลำดับชีวิตของการชาร์จหนึ่งครั้ง
   ───────────────────────────────────────────── */

export interface OcppStep {
  id: number;
  /** ทิศทางข้อความ */
  dir: "up" | "down" | "local";
  actor: "ผู้ใช้" | "ตู้ชาร์จ" | "หลังบ้าน (CSMS)";
  message: string;
  detail: string;
}

export const OCPP_STEPS: OcppStep[] = [
  {
    id: 1,
    dir: "local",
    actor: "ตู้ชาร์จ",
    message: "BootNotification",
    detail: "ตู้เพิ่งเปิดเครื่อง รายงานรุ่น/เฟิร์มแวร์ให้หลังบ้านรู้จัก",
  },
  {
    id: 2,
    dir: "down",
    actor: "หลังบ้าน (CSMS)",
    message: "Accepted + Heartbeat",
    detail: "หลังบ้านตอบรับ และกำหนดให้ตู้ส่งสัญญาณชีพเป็นระยะ",
  },
  {
    id: 3,
    dir: "local",
    actor: "ผู้ใช้",
    message: "เสียบปลั๊ก + แตะบัตร/แอป",
    detail: "ผู้ใช้เสียบหัวชาร์จและยืนยันตัวตนเพื่อขอเริ่มชาร์จ",
  },
  {
    id: 4,
    dir: "up",
    actor: "ตู้ชาร์จ",
    message: "Authorize",
    detail: "ตู้ถามหลังบ้านว่าบัตร/บัญชีนี้มีสิทธิ์ชาร์จไหม",
  },
  {
    id: 5,
    dir: "up",
    actor: "ตู้ชาร์จ",
    message: "StartTransaction",
    detail: "ได้รับอนุญาตแล้ว เริ่มจ่ายไฟ และเปิดรายการคิดเงิน",
  },
  {
    id: 6,
    dir: "up",
    actor: "ตู้ชาร์จ",
    message: "MeterValues (ทุก ๆ นาที)",
    detail: "รายงานพลังงานสะสม (kWh) เรื่อย ๆ ระหว่างชาร์จ",
  },
  {
    id: 7,
    dir: "up",
    actor: "ตู้ชาร์จ",
    message: "StopTransaction",
    detail: "ถอดปลั๊กหรือแบตเต็ม ปิดรายการ สรุปหน่วยไฟเพื่อคิดเงิน",
  },
];

/* ─────────────────────────────────────────────
   4) Peak shaving — แบตช่วยรีดพีคโหลด
   ───────────────────────────────────────────── */

export interface PeakPoint {
  hour: number;
  demandKw: number; // ความต้องการไฟดิบของอาคาร
  batteryKw: number; // + แบตช่วยจ่าย, − แบตชาร์จเก็บ
}

/** โหลดอาคารพาณิชย์ 1 วัน — มีพีคช่วงเที่ยงและเย็น */
export const PEAK_DAY: PeakPoint[] = [
  { hour: 0, demandKw: 30, batteryKw: -20 },
  { hour: 2, demandKw: 28, batteryKw: -22 },
  { hour: 4, demandKw: 32, batteryKw: -18 },
  { hour: 6, demandKw: 55, batteryKw: 0 },
  { hour: 8, demandKw: 88, batteryKw: 0 },
  { hour: 10, demandKw: 120, batteryKw: 30 },
  { hour: 12, demandKw: 135, batteryKw: 45 },
  { hour: 14, demandKw: 128, batteryKw: 38 },
  { hour: 16, demandKw: 110, batteryKw: 20 },
  { hour: 18, demandKw: 95, batteryKw: 5 },
  { hour: 20, demandKw: 70, batteryKw: 0 },
  { hour: 22, demandKw: 45, batteryKw: -10 },
];

/** เพดานที่การไฟฟ้าคิดค่า demand charge */
export const PEAK_CEILING_KW = 95;
