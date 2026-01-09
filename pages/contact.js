import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import config from "../config.json";
import emailjs from "emailjs-com";

export default function Contact() {
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const templateParams = Object.fromEntries(form.entries());
    try {
      await emailjs.send(
        config.emailjs.service_id,
        config.emailjs.template_id,
        templateParams,
        config.emailjs.public_key
      );
      setStatus("SENT");
    } catch (err) {
      console.error(err);
      setStatus("ERROR");
    }
  }

  return (
    <>
      <Head>
        <title>Contact — {config.company.name}</title>
      </Head>

      <Header onSearch={() => {}} config={config.company} />

      <main className="contact-page">
        <h2>Contact Us</h2>
        <p>Email: {config.company.email} • WhatsApp: {config.company.phone}</p>

        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            Name
            <input name="from_name" required />
          </label>
          <label>
            Email
            <input name="reply_to" type="email" required />
          </label>
          <label>
            Message
            <textarea name="message" required />
          </label>
          <button type="submit">Send</button>
        </form>

        {status === "SENT" && <p className="success">Thanks — we will contact you.</p>}
        {status === "ERROR" && <p className="error">Error sending. Try again later.</p>}
      </main>

      <Footer config={config.company} />
    </>
  );
}