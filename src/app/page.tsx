import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/ui/Section";
import { ArchitectureFlow } from "@/components/ArchitectureFlow";
import { StandardsExplorer } from "@/components/StandardsExplorer";
import { RangePowerChart } from "@/components/RangePowerChart";
import { MqttFlow } from "@/components/MqttFlow";
import { ProtocolCompare } from "@/components/ProtocolCompare";
import { EnergyIoT } from "@/components/EnergyIoT";
import { SolarDaySimulator } from "@/components/SolarDaySimulator";
import { EvChargingTypes } from "@/components/EvChargingTypes";
import { OcppSequence } from "@/components/OcppSequence";
import { PeakShaving } from "@/components/PeakShaving";
import { ConnectionPlanner } from "@/components/ConnectionPlanner";
import { SecurityShield } from "@/components/SecurityShield";
import { IoTWorkshop } from "@/components/IoTWorkshop";
import { FleetLifecycle } from "@/components/FleetLifecycle";
import { KnowledgeCheck } from "@/components/KnowledgeCheck";

export default function Home() {
  return (
    <div id="top" className="relative z-10">
      <Nav />
      <Hero />

      <main>
        <Section
          id="architecture"
          eyebrow="ภาพรวม"
          title="ข้อมูลเดินทางจากเซนเซอร์ไปถึงมือเราอย่างไร"
          intro="ทุกระบบ IoT มีโครงสร้างหลักคล้ายกัน 4 ชั้น ลองดูเส้นทางของข้อมูลหนึ่งก้อนเคลื่อนผ่านแต่ละชั้น"
        >
          <ArchitectureFlow />
        </Section>

        <Section
          id="standards"
          eyebrow="มาตรฐานการเชื่อมต่อ"
          title="เลือกมาตรฐาน แล้วดูว่ามันทำงานอย่างไร"
          intro="แต่ละมาตรฐานออกแบบมาเพื่องานต่างกัน — ระยะใกล้/ไกล เร็ว/ช้า กินไฟมาก/น้อย คลิกที่แต่ละชื่อเพื่อดูภาพเคลื่อนไหวและรายละเอียด"
        >
          <StandardsExplorer />
        </Section>

        <Section
          id="compare"
          eyebrow="เปรียบเทียบ"
          title="ระยะทำการ ปะทะ การใช้พลังงาน"
          intro="ไม่มีมาตรฐานไหน 'ดีที่สุด' มีแต่ 'เหมาะที่สุดกับงาน' กราฟนี้ช่วยให้เห็นภาพการแลกเปลี่ยน (trade-off)"
        >
          <RangePowerChart />
        </Section>

        <Section
          id="planner"
          eyebrow="ลงมือออกแบบ · เลือกเครือข่าย"
          title="โจทย์ต่างกัน คำตอบที่เหมาะก็เปลี่ยน"
          intro="ลองกำหนดระยะ แหล่งพลังงาน และปริมาณข้อมูล แล้วดูว่า architecture แบบใดเหมาะเป็นจุดเริ่มต้น"
        >
          <ConnectionPlanner />
        </Section>

        <Section
          id="protocols"
          eyebrow="โปรโตคอลข้อมูล"
          title="เมื่อเชื่อมต่อได้แล้ว จะคุยกันด้วยภาษาอะไร"
          intro="การเชื่อมต่อ (เช่น Wi-Fi) เป็นแค่ 'ถนน' ส่วนโปรโตคอลข้อมูลคือ 'ภาษา' ที่อุปกรณ์ใช้สื่อสารกันบนถนนนั้น MQTT เป็นที่นิยมที่สุดใน IoT"
        >
          <div className="space-y-10">
            <MqttFlow />
            <ProtocolCompare />
          </div>
        </Section>

        <Section
          id="workshop"
          eyebrow="ลงมือออกแบบ · End-to-End"
          title="ตาม packet หนึ่งก้อน ตั้งแต่ Sensor จนเกิด Alert"
          intro="ระบบจริงไม่ได้จบที่การเชื่อมต่อ ลองดู topic, payload, database และสิ่งที่ควรเกิดขึ้นเมื่ออินเทอร์เน็ตหลุด"
        >
          <IoTWorkshop />
        </Section>

        <Section
          id="security"
          eyebrow="ระบบจริง · Security"
          title="IoT ที่เชื่อมต่อได้ ต้องป้องกันตัวเองได้ด้วย"
          intro="ความปลอดภัยไม่ใช่กล่องใบเดียว แต่เป็นเกราะหลายชั้นตั้งแต่ตัวอุปกรณ์ เครือข่าย ไปจนถึง firmware"
        >
          <SecurityShield />
        </Section>

        <Section
          id="energy"
          eyebrow="กรณีศึกษา · พลังงาน"
          title="IoT พลังงาน: ตู้ชาร์จ EV, โซลาร์ และสมาร์ตมิเตอร์"
          intro="อุปกรณ์พลังงานมีมาตรฐานเฉพาะของตัวเอง เลือกอุปกรณ์เพื่อดูว่าพลังงานและข้อมูลไหลอย่างไร และคุยกันด้วยโปรโตคอลอะไร"
        >
          <EnergyIoT />
        </Section>

        <Section
          id="solar-day"
          eyebrow="กรณีศึกษา · โซลาร์"
          title="ลองดู IoT บริหารพลังงานบ้านโซลาร์ตลอด 24 ชั่วโมง"
          intro="หัวใจของบ้านโซลาร์ยุคใหม่คือสมองที่ตัดสินใจทุกวินาที — เก็บไฟเข้าแบต ใช้เอง หรือขายคืนกริด กดเล่นแล้วดูพลังงานเคลื่อนผ่านทั้งวัน"
        >
          <SolarDaySimulator />
        </Section>

        <Section
          id="charging"
          eyebrow="กรณีศึกษา · สถานีชาร์จ EV"
          title="สถานีชาร์จทำงานอย่างไร และทำไม DC ถึงเร็วกว่า"
          intro="ตั้งแต่ชาร์จช้า ๆ ที่บ้านจนถึงตู้ Ultra-Fast ริมไฮเวย์ มาดูความต่างของกำลังไฟ หัวชาร์จ และเบื้องหลังการคุยกันด้วยโปรโตคอล OCPP"
        >
          <div className="space-y-10">
            <EvChargingTypes />
            <OcppSequence />
          </div>
        </Section>

        <Section
          id="smartgrid"
          eyebrow="กรณีศึกษา · สมาร์ตกริด"
          title="แบตเตอรี่ช่วยรีดยอดพีค ลดค่าไฟอาคารได้อย่างไร"
          intro="ในระดับอาคารและกริด ระบบ IoT ใช้แบตเตอรี่จ่ายไฟแทนช่วงพีค (peak shaving) เพื่อกดยอดความต้องการไฟฟ้าสูงสุดที่การไฟฟ้านำไปคิดเงิน — ลองเปิด/ปิดระบบดูผล"
        >
          <PeakShaving />
        </Section>

        <Section
          id="operations"
          eyebrow="ระบบจริง · Reliability & Lifecycle"
          title="ติดตั้งเสร็จ คือวันแรกของการดูแลอุปกรณ์"
          intro="ดูสถานะ fleet, เลือกระดับการส่งข้อความ และทำความเข้าใจวงจรชีวิตตั้งแต่ลงทะเบียนจนปลดระวาง"
        >
          <FleetLifecycle />
        </Section>

        <Section
          id="quiz"
          eyebrow="ทบทวน"
          title="ลองเลือกคำตอบจากสถานการณ์จริง"
          intro="แบบทดสอบสั้น ๆ เพื่อเชื่อมภาพทั้งหมดเข้าด้วยกัน ตั้งแต่การเลือกเครือข่ายจนถึงการรับมือเมื่อระบบมีปัญหา"
        >
          <KnowledgeCheck />
        </Section>
      </main>

      <footer className="border-t border-[var(--color-border)] px-5 py-10 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 text-sm text-[var(--color-text-dim)]">
          <p className="font-semibold text-[var(--color-text-soft)]">
            IoT Connect — สื่อการเรียนรู้มาตรฐานการเชื่อมต่ออุปกรณ์ IoT
          </p>
          <p>
            ค่าตัวเลขต่าง ๆ เป็นค่าโดยประมาณเพื่อการเรียนรู้ · สร้างด้วย Next.js +
            Framer Motion
          </p>
        </div>
      </footer>
    </div>
  );
}
