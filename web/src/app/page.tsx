import styles from "./page.module.css";
import {
  PrimaryPhraseExplained,
  TranslationExplorer,
} from "@/components/TranslationExplorer";

const scenarios = [
  {
    title: "When testing a device",
    swedish:
      "Du håller upp fjärrkontrollen och frågar: “Vad gör denna knapp?”",
    english:
      "You hold up the remote control and ask: “What does this button do?”",
  },
  {
    title: "Curiosity in a museum",
    swedish:
      "Framför en installation undrar du: “Vad gör denna del av maskinen?”",
    english:
      "Standing by an exhibit you ask: “What does this part of the machine do?”",
  },
  {
    title: "Comparing options",
    swedish:
      "När du väljer mellan två program: “Vad gör denna jämfört med den andra?”",
    english:
      "While choosing between two apps: “What does this one do compared to the other?”",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.pretitle}>Swedish phrase deep-dive</p>
          <h1>Vad gör denna?</h1>
          <p className={styles.subtitle}>
            A concise guide that explains how the Swedish question works,
            translates, and adapts in real conversations. Explore each word,
            understand grammar, and try your own phrases.
          </p>
        </section>

        <PrimaryPhraseExplained />

        <TranslationExplorer />

        <section className={styles.scenarios}>
          <h2>When you might ask it</h2>
          <div className={styles.scenarioGrid}>
            {scenarios.map((scenario) => (
              <article key={scenario.title} className={styles.scenarioCard}>
                <h3>{scenario.title}</h3>
                <p className={styles.scenarioSwedish}>{scenario.swedish}</p>
                <p className={styles.scenarioEnglish}>{scenario.english}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
