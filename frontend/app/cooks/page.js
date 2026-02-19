"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function CooksPage() {
  const [cooks, setCooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCooks();
  }, []);

  const router = useRouter();

  const fetchCooks = async () => {
    const res = await fetch("http://localhost:5000/api/cooks");
    const data = await res.json();
    setCooks(data);
    setLoading(false);
  };

  const deleteCook = async (id) => {
    await fetch(`http://localhost:5000/api/cooks/${id}`, {
      method: "DELETE",
    });

    setCooks(cooks.filter((cook) => cook._id !== id));
  };

  const filteredCooks = cooks.filter((cook) =>
    cook.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>👨‍🍳 Meet Our Chefs</h1>

      <input
        type="text"
        placeholder="Search cook..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {loading ? (
        <p style={{ color: "white", textAlign: "center" }}>
          Loading chefs...
        </p>
      ) : (
        <div style={styles.grid}>
          {filteredCooks.map((cook) => (
            <div key={cook._id} style={styles.card}>
              <div style={styles.imageContainer}>
                <img
                  src={`http://localhost:5000/uploads/${cook.image}`}
                  alt={cook.name}
                  style={styles.image}
                />
              </div>

              <h3 style={styles.name}>{cook.name}</h3>

              <div style={styles.buttons}>
                <button
                  style={styles.editBtn}
                  onClick={() => router.push(`/edit/${cook._id}`)}

                >
                  ✏ Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteCook(cook._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "50px",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
  },
  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "20px",
    fontSize: "32px",
  },
  search: {
    display: "block",
    margin: "0 auto 40px auto",
    padding: "12px",
    width: "300px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "20px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    transition: "0.3s",
  },
  imageContainer: {
    overflow: "hidden",
    borderRadius: "15px",
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  name: {
    margin: "15px 0",
    fontSize: "20px",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  editBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#f44336",
    color: "white",
    cursor: "pointer",
  },
};
