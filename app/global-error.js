"use client";

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
          An unexpected error happened. Please try again.
        </p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: "1.5rem",
            background: "#f97316",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.6rem 1.2rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}