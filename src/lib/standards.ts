// ข้อมูลมาตรฐานการเชื่อมต่ออุปกรณ์ IoT
// แหล่งอ้างอิง: ข้อมูลทั่วไปของแต่ละมาตรฐาน (ค่าโดยประมาณสำหรับการเรียนรู้)

export type StandardCategory = "short" | "lpwan" | "cellular" | "wired";

export type RangeUnit = "m" | "km";

export interface ConnectivityStandard {
  id: string;
  name: string;
  fullName: string;
  category: StandardCategory;
  /** สีหลักของมาตรฐานนี้ (ใช้ใน UI/อนิเมชั่น) */
  color: string;
  tagline: string;
  /** ระยะทำการโดยประมาณ (เมตร) ใช้สเกล log ในกราฟ */
  rangeMeters: number;
  rangeLabel: string;
  /** อัตราข้อมูลโดยประมาณ (bit/s) */
  dataRateBps: number;
  dataRateLabel: string;
  /** การใช้พลังงาน 1 (ต่ำสุด) - 5 (สูงสุด) */
  power: number;
  powerLabel: string;
  frequency: string;
  topology: "star" | "mesh" | "p2p";
  bestFor: string[];
  howItWorks: string;
}

export const STANDARDS: ConnectivityStandard[] = [
  {
    id: "wifi",
    name: "Wi-Fi",
    fullName: "IEEE 802.11",
    category: "short",
    color: "#38bdf8",
    tagline: "แบนด์วิดท์สูง ในบ้าน/อาคาร",
    rangeMeters: 50,
    rangeLabel: "~50 ม.",
    dataRateBps: 600_000_000,
    dataRateLabel: "สูงสุดหลายร้อย Mbps",
    power: 5,
    powerLabel: "สูง",
    frequency: "2.4 / 5 GHz",
    topology: "star",
    bestFor: ["กล้องวงจรปิด", "สมาร์ตทีวี", "อุปกรณ์ที่มีไฟเลี้ยงตลอด"],
    howItWorks:
      "อุปกรณ์ทุกตัวเชื่อมตรงเข้า Access Point (เราเตอร์) แบบดาว ส่งข้อมูลได้เร็วมากแต่กินไฟสูง จึงเหมาะกับอุปกรณ์ที่เสียบปลั๊กไฟ",
  },
  {
    id: "ble",
    name: "Bluetooth LE",
    fullName: "Bluetooth Low Energy",
    category: "short",
    color: "#818cf8",
    tagline: "ระยะสั้น ประหยัดไฟมาก",
    rangeMeters: 30,
    rangeLabel: "~10–30 ม.",
    dataRateBps: 2_000_000,
    dataRateLabel: "~1–2 Mbps",
    power: 1,
    powerLabel: "ต่ำมาก",
    frequency: "2.4 GHz",
    topology: "p2p",
    bestFor: ["สายรัดข้อมือ", "เซนเซอร์สุขภาพ", "บีคอน", "หูฟัง"],
    howItWorks:
      "จับคู่อุปกรณ์สองตัวแบบจุดต่อจุด ส่งข้อมูลเป็นช่วงสั้น ๆ แล้วหลับเพื่อประหยัดพลังงาน แบตเตอรี่กระดุมอยู่ได้เป็นเดือนหรือเป็นปี",
  },
  {
    id: "zigbee",
    name: "Zigbee",
    fullName: "IEEE 802.15.4",
    category: "short",
    color: "#fb923c",
    tagline: "เมช (mesh) สำหรับสมาร์ตโฮม",
    rangeMeters: 100,
    rangeLabel: "~10–100 ม. (ต่อฮอป)",
    dataRateBps: 250_000,
    dataRateLabel: "~250 kbps",
    power: 2,
    powerLabel: "ต่ำ",
    frequency: "2.4 GHz",
    topology: "mesh",
    bestFor: ["หลอดไฟอัจฉริยะ", "เซนเซอร์ประตู", "สวิตช์", "ระบบบ้านอัจฉริยะ"],
    howItWorks:
      "อุปกรณ์แต่ละตัวช่วยส่งต่อข้อมูล (relay) ให้กันเป็นตาข่าย ยิ่งมีอุปกรณ์มาก สัญญาณยิ่งครอบคลุมไกลขึ้นและทนทานต่อจุดเสีย",
  },
  {
    id: "nfc",
    name: "NFC",
    fullName: "Near Field Communication",
    category: "short",
    color: "#f472b6",
    tagline: "แตะใกล้ ๆ เพื่อสื่อสาร",
    rangeMeters: 0.1,
    rangeLabel: "< 10 ซม.",
    dataRateBps: 424_000,
    dataRateLabel: "~424 kbps",
    power: 1,
    powerLabel: "ต่ำมาก (หรือไม่ใช้)",
    frequency: "13.56 MHz",
    topology: "p2p",
    bestFor: ["จ่ายเงินแตะบัตร", "คีย์การ์ด", "แท็กข้อมูลสินค้า"],
    howItWorks:
      "ต้องนำอุปกรณ์เข้าใกล้กันมาก ๆ แท็กแบบ passive ไม่ต้องใช้แบตเตอรี่ เพราะรับพลังงานจากสนามแม่เหล็กของเครื่องอ่าน",
  },
  {
    id: "lorawan",
    name: "LoRaWAN",
    fullName: "Long Range WAN",
    category: "lpwan",
    color: "#34d399",
    tagline: "ระยะไกลมาก ข้อมูลน้อย ประหยัดไฟ",
    rangeMeters: 15_000,
    rangeLabel: "2–15 กม.",
    dataRateBps: 50_000,
    dataRateLabel: "~0.3–50 kbps",
    power: 1,
    powerLabel: "ต่ำมาก",
    frequency: "Sub-GHz (920–925 MHz ในไทย)",
    topology: "star",
    bestFor: ["เซนเซอร์เกษตร", "มิเตอร์น้ำ/ไฟ", "ติดตามทรัพย์สิน"],
    howItWorks:
      "เซนเซอร์ส่งข้อมูลก้อนเล็ก ๆ ไปยังเกตเวย์ที่อยู่ไกลหลายกิโลเมตร ด้วยคลื่นความถี่ต่ำที่ทะลุทะลวงดี แบตเตอรี่อยู่ได้หลายปี",
  },
  {
    id: "nbiot",
    name: "NB-IoT",
    fullName: "Narrowband IoT",
    category: "cellular",
    color: "#a78bfa",
    tagline: "ใช้เครือข่ายมือถือ ครอบคลุมกว้าง",
    rangeMeters: 10_000,
    rangeLabel: "หลาย กม. (ตามเสาสัญญาณ)",
    dataRateBps: 250_000,
    dataRateLabel: "~250 kbps",
    power: 2,
    powerLabel: "ต่ำ",
    frequency: "คลื่นมือถือใบอนุญาต (LTE)",
    topology: "star",
    bestFor: ["มิเตอร์อัจฉริยะ", "เซนเซอร์ในเมือง", "อุปกรณ์ที่ต้องการความเสถียร"],
    howItWorks:
      "ใช้โครงข่ายมือถือ (เสา 4G/5G) ที่มีอยู่แล้ว จึงครอบคลุมทั่วถึงและทะลุเข้าในอาคารได้ดี เหมาะกับอุปกรณ์ที่กระจายทั่วเมือง",
  },
  {
    id: "thread",
    name: "Thread + Matter",
    fullName: "IPv6 Mesh + Smart Home Application Standard",
    category: "short",
    color: "#2dd4bf",
    tagline: "สมาร์ตโฮมข้ามยี่ห้อ บนเครือข่ายเมช",
    rangeMeters: 100,
    rangeLabel: "~10–100 ม. (ต่อฮอป)",
    dataRateBps: 250_000,
    dataRateLabel: "~250 kbps",
    power: 2,
    powerLabel: "ต่ำ",
    frequency: "2.4 GHz",
    topology: "mesh",
    bestFor: ["หลอดไฟ/สวิตช์", "เซนเซอร์บ้าน", "อุปกรณ์ Matter"],
    howItWorks:
      "Thread สร้างเครือข่าย mesh ประหยัดไฟที่ใช้ IPv6 ส่วน Matter กำหนดภาษากลางระดับแอป ทำให้อุปกรณ์สมาร์ตโฮมต่างยี่ห้อทำงานร่วมกันได้ง่ายขึ้น",
  },
  {
    id: "ltem",
    name: "LTE-M",
    fullName: "LTE Cat-M1",
    category: "cellular",
    color: "#c084fc",
    tagline: "เครือข่ายมือถือสำหรับอุปกรณ์ที่เคลื่อนที่",
    rangeMeters: 20_000,
    rangeLabel: "หลาย กม. (ตามเสาสัญญาณ)",
    dataRateBps: 1_000_000,
    dataRateLabel: "~1 Mbps",
    power: 3,
    powerLabel: "ต่ำ–ปานกลาง",
    frequency: "คลื่นมือถือใบอนุญาต (LTE)",
    topology: "star",
    bestFor: ["ติดตามรถ", "Wearable", "อุปกรณ์ที่ต้องเคลื่อนที่"],
    howItWorks:
      "LTE-M ใช้โครงข่ายมือถือเหมือน NB-IoT แต่รองรับการเคลื่อนที่และข้อมูลได้เร็วกว่า แลกกับการใช้พลังงานที่สูงขึ้นเล็กน้อย",
  },
  {
    id: "ethernet",
    name: "Ethernet",
    fullName: "IEEE 802.3",
    category: "wired",
    color: "#f59e0b",
    tagline: "สายสัญญาณเสถียร เร็ว และคาดเดาได้",
    rangeMeters: 100,
    rangeLabel: "~100 ม. ต่อช่วงสาย",
    dataRateBps: 1_000_000_000,
    dataRateLabel: "100 Mbps–1 Gbps+",
    power: 4,
    powerLabel: "ปานกลาง–สูง",
    frequency: "สายทองแดง / Fiber",
    topology: "star",
    bestFor: ["กล้องโรงงาน", "Gateway", "ระบบที่ห้ามสัญญาณหลุด"],
    howItWorks:
      "อุปกรณ์ต่อสายเข้ากับสวิตช์โดยตรง จึงเสถียรและมี latency คาดเดาได้ บางระบบใช้ PoE เพื่อส่งทั้งข้อมูลและไฟเลี้ยงในสายเดียว",
  },
  {
    id: "rs232",
    name: "RS-232",
    fullName: "TIA-232 Serial Communication",
    category: "wired",
    color: "#f97316",
    tagline: "สายอนุกรมจุดต่อจุดสำหรับอุปกรณ์ใกล้กัน",
    rangeMeters: 15,
    rangeLabel: "มาตรฐานแนะนำ ~15 ม.",
    dataRateBps: 115_200,
    dataRateLabel: "มักใช้ 9.6–115.2 kbps",
    power: 2,
    powerLabel: "ต่ำ",
    frequency: "Single-ended TX / RX / GND",
    topology: "p2p",
    bestFor: ["Console port", "เครื่องชั่ง", "เครื่องอ่านบาร์โค้ด", "อุปกรณ์รุ่นเก่า"],
    howItWorks:
      "RS-232 ส่งข้อมูลอนุกรมระหว่างอุปกรณ์สองตัวผ่านสาย TX, RX และ GND ใช้งานง่ายและพบได้บ่อยในอุปกรณ์รุ่นเก่า แต่ระยะสั้นและไวต่อสัญญาณรบกวนกว่า RS-485",
  },
  {
    id: "rs485",
    name: "RS-485 + Modbus",
    fullName: "TIA-485 + Modbus RTU",
    category: "wired",
    color: "#fb7185",
    tagline: "สายคู่ทนสัญญาณรบกวนสำหรับโรงงาน",
    rangeMeters: 1_200,
    rangeLabel: "สูงสุด ~1.2 กม.",
    dataRateBps: 115_200,
    dataRateLabel: "มักใช้ 9.6–115.2 kbps",
    power: 2,
    powerLabel: "ต่ำ",
    frequency: "Differential twisted pair",
    topology: "p2p",
    bestFor: ["มิเตอร์", "อินเวอร์เตอร์", "PLC", "เครื่องจักร"],
    howItWorks:
      "RS-485 เป็นชั้นสายสัญญาณที่ทน noise ส่วน Modbus RTU เป็นภาษาที่ใช้ถาม–ตอบค่า register ของอุปกรณ์ เหมาะกับงานอุตสาหกรรมที่ต้องการความเรียบง่ายและเสถียร",
  },
];

export type ProtocolId = "mqtt" | "coap" | "http";

export interface DataProtocol {
  id: ProtocolId;
  name: string;
  pattern: string;
  transport: string;
  color: string;
  summary: string;
  pros: string[];
  cons: string[];
}

export const PROTOCOLS: DataProtocol[] = [
  {
    id: "mqtt",
    name: "MQTT",
    pattern: "Publish / Subscribe",
    transport: "TCP",
    color: "#38bdf8",
    summary:
      "อุปกรณ์ส่งข้อมูลไปที่ตัวกลาง (Broker) ตาม 'หัวข้อ' (topic) ใครสนใจหัวข้อไหนก็สมัครรับ ไม่ต้องรู้จักกันโดยตรง",
    pros: ["กินแบนด์วิดท์น้อย", "เหมาะกับอุปกรณ์จำนวนมาก", "รองรับการขาดการเชื่อมต่อ"],
    cons: ["ต้องมี Broker เป็นตัวกลาง", "ทำงานบน TCP จึงมี overhead กว่า UDP"],
  },
  {
    id: "coap",
    name: "CoAP",
    pattern: "Request / Response",
    transport: "UDP",
    color: "#34d399",
    summary:
      "คล้าย HTTP แต่ออกแบบมาให้เบาสำหรับอุปกรณ์เล็ก ทำงานบน UDP ใช้รูปแบบ GET/POST/PUT/DELETE เหมือนเว็บ",
    pros: ["เบามาก เหมาะกับอุปกรณ์ทรัพยากรจำกัด", "ใช้ UDP จึงเร็ว", "เข้าใจง่ายแบบ REST"],
    cons: ["UDP ไม่การันตีการส่ง (ต้องจัดการเอง)", "ระบบนิเวศเล็กกว่า MQTT/HTTP"],
  },
  {
    id: "http",
    name: "HTTP(S)",
    pattern: "Request / Response",
    transport: "TCP",
    color: "#fb923c",
    summary:
      "โปรโตคอลเว็บมาตรฐาน ใช้ได้ทันทีกับทุกระบบ แต่ header ใหญ่และกินทรัพยากร จึงไม่เหมาะกับอุปกรณ์ที่ใช้แบตเตอรี่",
    pros: ["รองรับทุกที่", "เครื่องมือ/ไลบรารีพร้อม", "เข้ากับ Web/Cloud ได้ง่าย"],
    cons: ["Header ใหญ่ กินแบนด์วิดท์", "กินไฟมากกว่า", "ไม่เหมาะกับ real-time push"],
  },
];

export const CATEGORY_LABELS: Record<StandardCategory, string> = {
  short: "ระยะสั้น (Short-range)",
  lpwan: "ระยะไกลพลังงานต่ำ (LPWAN)",
  cellular: "เครือข่ายมือถือ (Cellular IoT)",
  wired: "ระบบใช้สาย (Wired / Industrial)",
};
