"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditCook() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCook = async () => {
      const res = await fetch("http://localhost:5000/api/cooks");
      const data = await res.json();
      const cook = data.find((c) => c._id === id);
      if (cook) {
        setName(cook.name);
        setPreview(`http://localhost:5000/uploads/${cook.image}`);
      }
    };

    fetchCook();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      await fetch(`http://localhost:5000/api/cooks/${id}`, {
        method: "PUT",
        body: formData,
      });

      toast.success("Cook updated successfully 🎉");
      router.push("/cooks");
    } catch (err) {
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>✏ Edit Cook</h2>

        <form onSubmit={handleUpdate} style={styles.form}>
          <label style={styles.label}>Cook Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Upload New Image (Optional)</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
            style={styles.file}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={styles.preview}
            />
          )}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Updating..." : "Update Cook"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #141E30, #243B55)",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    width: "380px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#222",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#444",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  file: {
    padding: "8px",
  },
  preview: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginTop: "10px",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};
