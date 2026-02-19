"use client";

import { useState } from "react";

export default function AddCook() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !image) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/cooks", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      alert("Cook added successfully 🎉");
      setName("");
      setImage(null);
    } catch (err) {
      alert("Error adding cook ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>👨‍🍳 Add New Cook</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter cook name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
            style={styles.file}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Adding..." : "Add Cook"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "15px",
    width: "350px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  file: {
    padding: "10px",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#667eea",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};
