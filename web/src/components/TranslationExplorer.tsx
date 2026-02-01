"use client";

import { useMemo, useState } from "react";
import styles from "./TranslationExplorer.module.css";

type DictionaryEntry = {
  translation: string;
  partOfSpeech: string;
  notes?: string;
  literal?: string;
};

type WordAnalysis = {
  word: string;
  normalized: string;
  entry?: DictionaryEntry;
  isKnown: boolean;
};

const PRIMARY_PHRASE = "Vad gör denna?";

const DICTIONARY: Record<string, DictionaryEntry> = {
  vad: {
    translation: "what",
    partOfSpeech: "question word (interrogative pronoun)",
    notes: "Used to ask about the identity, nature, or purpose of something.",
  },
  gör: {
    translation: "does / is doing",
    partOfSpeech: "verb (present tense of 'göra')",
    notes: "Matches English 'do/does' and can also signal 'is performing'.",
  },
  denna: {
    translation: "this one",
    partOfSpeech: "demonstrative pronoun",
    notes: "Points to a specific object that is grammatically common-gender.",
  },
  den: {
    translation: "it / the",
    partOfSpeech: "pronoun / definite article",
    notes: "Used for common-gender nouns; similar to 'it' or 'that'.",
  },
  här: {
    translation: "here",
    partOfSpeech: "adverb",
  },
  "vad gör du": {
    translation: "what are you doing",
    partOfSpeech: "phrase",
    notes: "Common follow-up question directed at a person.",
  },
};

const REMOVE_CHARS_REGEX = /[!?.,;:()[\]"“”'«»]/g;

function normalizeToken(token: string) {
  return token.trim().toLowerCase().replace(REMOVE_CHARS_REGEX, "");
}

function analyzePhrase(phrase: string): WordAnalysis[] {
  const tokens = phrase.split(/\s+/).filter(Boolean);
  return tokens.map((token) => {
    const normalized = normalizeToken(token);
    const entry = DICTIONARY[normalized];
    return {
      word: token,
      normalized,
      entry,
      isKnown: Boolean(entry),
    };
  });
}

function summarizeTranslation(analysis: WordAnalysis[]) {
  const translations = analysis.map((item) => {
    if (item.entry) {
      return item.entry.translation;
    }
    if (item.normalized.length === 0) {
      return undefined;
    }
    return `(${item.word})`;
  });

  return translations.filter(Boolean).join(" ");
}

function hasUnknownWords(analysis: WordAnalysis[]) {
  return analysis.some((item) => !item.isKnown && item.normalized.length > 0);
}

export function TranslationExplorer() {
  const [phrase, setPhrase] = useState(PRIMARY_PHRASE);

  const analysis = useMemo(() => analyzePhrase(phrase), [phrase]);
  const summary = useMemo(() => summarizeTranslation(analysis), [analysis]);
  const showUnknownNotice = useMemo(
    () => hasUnknownWords(analysis),
    [analysis],
  );

  return (
    <section className={styles.container} aria-label="Phrase translator">
      <header className={styles.header}>
        <p className={styles.label}>Swedish phrase</p>
        <div className={styles.inputShell}>
          <input
            value={phrase}
            onChange={(event) => setPhrase(event.target.value)}
            placeholder="Skriv en svensk fras…"
            aria-label="Swedish phrase to translate"
          />
        </div>
        <p className={styles.caption}>
          Try typing your own sentence to see a word-by-word explanation.
        </p>
      </header>

      <div className={styles.summaryCard}>
        <p className={styles.summaryLabel}>Natural translation</p>
        <p className={styles.summaryValue}>
          {summary.length > 0 ? summary : "…"}
        </p>
        {showUnknownNotice ? (
          <p className={styles.warning}>
            Some words are outside the mini-dictionary, so they remain in their
            original form.
          </p>
        ) : null}
      </div>

      <div className={styles.analysisGrid}>
        {analysis.map((item) => (
          <article
            key={`${item.word}-${item.normalized}`}
            className={styles.wordCard}
          >
            <h3 className={styles.wordOriginal}>{item.word}</h3>
            <p className={styles.wordNormalized}>{item.normalized || "—"}</p>

            {item.entry ? (
              <>
                <p className={styles.wordTranslation}>{item.entry.translation}</p>
                <p className={styles.wordPartOfSpeech}>
                  {item.entry.partOfSpeech}
                </p>
                {item.entry.notes ? (
                  <p className={styles.wordNotes}>{item.entry.notes}</p>
                ) : null}
              </>
            ) : (
              <p className={styles.wordMissing}>
                This word is not yet in the quick dictionary. Keep it as-is or
                consult a full translator for nuance.
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function PrimaryPhraseExplained() {
  const analysis = useMemo(() => analyzePhrase(PRIMARY_PHRASE), []);

  return (
    <section className={styles.primaryPhrase}>
      <header>
        <h2>What does “Vad gör denna?” mean?</h2>
        <p>
          Literally, the question breaks down into “what / does / this one” and
          is usually used when pointing at an object to ask what it does or what
          its purpose is.
        </p>
      </header>

      <div className={styles.primaryCard}>
        <p className={styles.primaryTitle}>Straightforward translation</p>
        <p className={styles.primaryTranslation}>“What does this do?”</p>
        <p className={styles.primaryDescription}>
          The phrase is a direct question about the function or effect of the
          specific thing the speaker is referring to.
        </p>
      </div>

      <ul className={styles.primaryList}>
        {analysis.map((item) => (
          <li key={item.word}>
            <span className={styles.primaryWord}>{item.word}</span>
            <span className={styles.primaryDetail}>
              {item.entry?.translation ?? "—"} ·{" "}
              {item.entry?.partOfSpeech ?? "outside mini-dictionary"}
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.contextCard}>
        <h3>Usage tip</h3>
        <p>
          “Denna” is formal or written Swedish. In everyday speech you are more
          likely to hear “Vad gör den här?” or, when referring to a device,
          “Vad gör den här knappen?” meaning “What does this button do?”.
        </p>
      </div>
    </section>
  );
}
