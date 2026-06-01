"use client";

import { useLang } from "@/lib/lang-context";
import styles from "./LangToggle.module.scss";

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.btn} ${lang === "id" ? styles.active : ""}`}
        onClick={() => setLang("id")}
        aria-label="Bahasa Indonesia"
      >
        ID
      </button>
      <span className={styles.sep}>|</span>
      <button
        className={`${styles.btn} ${lang === "en" ? styles.active : ""}`}
        onClick={() => setLang("en")}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
