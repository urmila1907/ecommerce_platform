"use client";
import {useEffect} from "react";

const About = () => {
    useEffect(() => {
        document.documentElement.style.scrollBehavior = "smooth";
      }, []);
      
  return (
    <div style={styles.aboutSection}>
      <h2 style={styles.heading}>About Us</h2>
      <p style={styles.description}>
        Welcome to [Your Store Name], where we offer high-quality products at affordable prices. Our mission is to provide an exceptional shopping experience while offering products that meet the highest standards of quality.
      </p>
      <h3 style={styles.subHeading}>Our Mission</h3>
      <p style={styles.mission}>
        We believe that everyone deserves access to quality products without breaking the bank. We are committed to delivering great value and customer service.
      </p>
      <h3 style={styles.subHeading}>Our Story</h3>
      <p style={styles.history}>
        Founded in [Year], our store began with the idea of creating an online platform that makes shopping more accessible and enjoyable for everyone. Since then, we’ve been growing and expanding our product range to cater to all your needs.
      </p>
      <h3 style={styles.subHeading}>Meet the Team</h3>
      <p style={styles.team}>
        We’re a small team of passionate individuals who care about delivering the best products and experiences to our customers. [Founder’s Name], our founder, started this journey with the goal of making online shopping easier and more fun.
      </p>
      <h3 style={styles.subHeading}>Why Choose Us?</h3>
      <ul style={styles.benefits}>
        <li>Fast and reliable shipping</li>
        <li>Secure and easy payment options</li>
        <li>Excellent customer service</li>
        <li>Quality products with a satisfaction guarantee</li>
      </ul>
      <div style={styles.cta}>
        <a href="/products" style={styles.ctaButton}>Shop Now</a>
      </div>
    </div>
  );
};

const styles = {
  aboutSection: {
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#f9f9f9", // Light gray background for a clean look
    color: "#456", // Muted color for text
  },
  heading: {
    fontSize: "2rem",
    color: "#456", // Consistent with your tagline color
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1.2rem",
    color: "#555", // Slightly lighter gray for the body text
    lineHeight: "1.6",
  },
  subHeading: {
    fontSize: "1.5rem",
    color: "#333", // Darker color for subheadings
    fontWeight: "bold",
    marginTop: "1rem",
  },
  mission: {
    fontSize: "1.1rem",
    color: "#333",
    fontStyle: "italic",
    marginBottom: "1rem",
  },
  history: {
    fontSize: "1rem",
    color: "#666", // Lighter gray for the history section
  },
  team: {
    fontSize: "1rem",
    color: "#666",
  },
  benefits: {
    listStyleType: "none",
    padding: 0,
    margin: "1rem 0",
    fontSize: "1rem",
    color: "#555", // Slightly muted gray
  },
  cta: {
    marginTop: "1rem",
  },
  ctaButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF", // A blue accent for the call to action button
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  ctaButtonHover: {
    backgroundColor: "#0056b3", // Darker blue for hover effect
  },
};

export default About;
