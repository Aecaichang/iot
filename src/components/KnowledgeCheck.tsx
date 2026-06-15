"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

const QUESTIONS = [
  {
    question: "เซนเซอร์ความชื้นในไร่ ส่งค่าทุก 30 นาที ควรเริ่มพิจารณาอะไร?",
    visual: "🌱  · · · · ·  🗼",
    answers: ["Wi-Fi", "LoRaWAN", "Ethernet"],
    correct: 1,
    reason: "LoRaWAN เหมาะกับข้อมูลน้อย ระยะไกล และอุปกรณ์ใช้แบตเตอรี่",
  },
  {
    question: "MQTT Broker ทำหน้าที่หลักอะไร?",
    visual: "🌡️ → ☁️ → 📱 💾 🚨",
    answers: ["วัดอุณหภูมิ", "ส่งต่อข้อความตาม topic", "เข้ารหัส firmware"],
    correct: 1,
    reason: "Broker รับข้อความจาก publisher แล้วส่งต่อให้ subscriber ที่สนใจ topic นั้น",
  },
  {
    question: "เมื่ออุปกรณ์ offline ระบบที่ทนทานควรทำอย่างไร?",
    visual: "📟  ✕ internet  →  📦 queue",
    answers: ["ทิ้งข้อมูลทันที", "Restart ตลอดเวลา", "เก็บข้อมูลแล้ว retry"],
    correct: 2,
    reason: "Offline buffering และ retry ช่วยลดข้อมูลสูญหายเมื่อเครือข่ายไม่เสถียร",
  },
] as const;

export function KnowledgeCheck() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = QUESTIONS[questionIndex];

  function choose(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.correct) setScore((value) => value + 1);
  }

  function next() {
    setSelected(null);
    setQuestionIndex((value) => (value + 1) % QUESTIONS.length);
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <span className="mono text-xs text-[var(--color-text-dim)]">คำถาม {questionIndex + 1}/{QUESTIONS.length}</span>
        <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-green)]">คะแนน {score}</span>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--color-bg)]">
        <motion.div className="h-full bg-[var(--color-cyan)]" animate={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={questionIndex} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
          <div className="my-7 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-6 text-center">
            <div className="mono text-xl tracking-[0.25em] text-[var(--color-cyan)] sm:text-3xl">{question.visual}</div>
          </div>
          <h3 className="text-xl font-semibold">{question.question}</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {question.answers.map((answer, index) => {
              const isCorrect = selected !== null && index === question.correct;
              const isWrong = selected === index && index !== question.correct;
              return (
                <button
                  key={answer}
                  onClick={() => choose(index)}
                  className="rounded-xl border p-4 text-left text-sm font-semibold transition-colors"
                  style={{
                    borderColor: isCorrect ? "#34d399" : isWrong ? "#fb7185" : "var(--color-border)",
                    background: isCorrect ? "color-mix(in oklch, #34d399 12%, var(--color-bg))" : isWrong ? "color-mix(in oklch, #fb7185 12%, var(--color-bg))" : "var(--color-bg)",
                  }}
                >
                  <span className="mono mr-2 text-[var(--color-text-dim)]">{String.fromCharCode(65 + index)}</span>{answer}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {selected !== null && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-4">
          <p className="max-w-2xl text-sm text-[var(--color-text-soft)]">
            <strong className={selected === question.correct ? "text-[var(--color-green)]" : "text-[#fb7185]"}>
              {selected === question.correct ? "ถูกต้อง — " : "ยังไม่ใช่ — "}
            </strong>
            {question.reason}
          </p>
          <Button tone="cyan" active onClick={next}>ข้อถัดไป →</Button>
        </motion.div>
      )}
    </Card>
  );
}
