"use client";
import { useState, useEffect } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <div style={styles.contactSection}>
      <h2 style={styles.heading}>Contact Us</h2>
      <p style={styles.description}>
        We’d love to hear from you! Whether you have a question about our products, services, or anything else, feel free to reach out to us.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="subject" style={styles.label}>Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="message" style={styles.label}>Your Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>
        <button type="submit" style={styles.submitButton}>Send Message</button>
      </form>
      <div style={styles.contactInfo}>
        <h3 style={styles.subHeading}>Our Contact Details</h3>
        <p>Email: <a href="mailto:contact@yourstore.com" style={styles.contactLink}>contact@yourstore.com</a></p>
        <p>Phone: <a href="tel:+123456789" style={styles.contactLink}>+123 456 789</a></p>
      </div>
    </div>
  );
};

const styles = {
  contactSection: {
    padding: "2rem",
    backgroundColor: "#f9f9f9", // Light background for contrast
    color: "#456", // Matching text color
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    color: "#456", // Consistent with other headings
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1.2rem",
    color: "#555", // Slightly lighter gray for body text
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    maxWidth: "500px",
    margin: "0 auto",
  },
  formGroup: {
    width: "100%",
    textAlign: "left",
  },
  label: {
    fontSize: "1rem",
    color: "#333", // Darker color for labels
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ddd", // Light border
    backgroundColor: "#fff",
    marginBottom: "1rem",
    color: "#333",
  },
  textarea: {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    marginBottom: "1rem",
    color: "#333",
    resize: "vertical",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF", // Blue for the submit button
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  submitButtonHover: {
    backgroundColor: "#0056b3", // Darker blue on hover
  },
  contactInfo: {
    marginTop: "2rem",
    textAlign: "center",
  },
  subHeading: {
    fontSize: "1.5rem",
    color: "#333", // Darker color for subheading
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  contactLink: {
    color: "#007BFF", // Blue links for contact
    textDecoration: "none",
  },
};

export default Contact;
