"use client";
import styles from "./redirect.module.css";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";


export default function RedirectPage() {
  // Target: February 2nd, 2026 at 12:00 PM PST
  const targetDate = new Date("2026-02-02T12:00:00-08:00").getTime();
  
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        redirect("/dashboard");
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={styles.container}>
      <div className={styles.portalCard}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
            Portal Locked
          </h1>
          <p className="mt-2 text-sm">
            You will be redirected when the hackathon begins.
          </p>
        </div>

        <div className={styles.timerGrid}>
          <div className={styles.timeItem}>
            <span className={styles.timeValue}>{timeLeft.d}</span>
            <span className={styles.timeLabel}>Days</span>
          </div>
          <div className={styles.timeItem}>
            <span className={styles.timeValue}>{timeLeft.h}</span>
            <span className={styles.timeLabel}>Hours</span>
          </div>
          <div className={styles.timeItem}>
            <span className={styles.timeValue}>{timeLeft.m}</span>
            <span className={styles.timeLabel}>Mins</span>
          </div>
          <div className={styles.timeItem}>
            <span className={styles.timeValue}>{timeLeft.s}</span>
            <span className={styles.timeLabel}>Secs</span>
          </div>
        </div>
      </div>
    </div>
  );
}