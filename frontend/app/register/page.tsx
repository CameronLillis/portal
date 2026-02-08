"use client";
import style from "../dashboard/dashboard.module.css";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";


export default function RegisterPage() {
  return (
    <div className={style.container}>
      <div className={style.portalCard}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
            Registration
          </h1>
          <p className="mt-2 text-sm">
            Register your account to join or create teams for the competition. If you have any questions, please contact the organizers.
          </p>
        </div>
      </div>
    </div>
  );
}