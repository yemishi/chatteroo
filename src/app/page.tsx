"use server"

import styles from "./page.module.css";

export default async function Home() {
  return (
    <div className={styles.page}>
      home page
    </div>
  );
}
