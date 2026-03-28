"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file!);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    alert("Uploaded!");
  };

  const ask = async () => {
    const res = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>RAG App</h2>

      <input type="file" onChange={(e) => setFile(e.target.files![0])} />
      <button onClick={upload}>Upload</button>

      <hr />

      <input
        placeholder="Ask question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={ask}>Ask</button>

      <p>{answer}</p>
    </div>
  );
}