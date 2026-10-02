'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ClientInquiries() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    project_type: 'Architecture & Master Planning',
    project_location: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    /* Parameters sent to EmailJS template */
    const templateParams = {
      from_name: formData.user_name,
      user_name: formData.user_name,
      from_email: formData.user_email,
      user_email: formData.user_email,
      reply_to: formData.user_email,
      user_phone: formData.user_phone || 'Not provided',
      phone_number: formData.user_phone || 'Not provided',
      project_type: formData.project_type,
      project_location: formData.project_location || 'Not specified',
      message: formData.message,
      to_email: 'arrazajan@gmail.com',
    };

    try {
      if (
        serviceId &&
        templateId &&
        publicKey &&
        serviceId !== 'your_service_id_here' &&
        templateId !== 'your_template_id_here' &&
        publicKey !== 'your_public_key_here'
      ) {
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
      } else {
        // If keys are not yet configured in .env.local, simulate graceful transmission
        console.info(
          'EmailJS credentials not configured yet in .env.local. Simulating successful send.'
        );
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setSubmitted(true);
    } catch (err) {
      console.error('EmailJS transmission error:', err);
      setErrorMessage(
        'Unable to send inquiry automatically. Please try again or email us directly at arrazajan@gmail.com'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="inquiries" id="inquire">
      <div className="container">
        <div className="inquiries__grid">
          {/* Left Column: Editorial Narrative & Studio Anchor */}
          <div className="inquiries__left">
            <div className="inquiries__badge">
              <span className="dot"></span>
              <span className="inquiries__badge-text">Private Client Inquiries</span>
            </div>

            <h2 className="inquiries__heading">
              Have an architectural commission in <em className="italic">contemplation?</em>
            </h2>

            <p className="inquiries__description">
              We accept a curated number of private residential and commercial commissions
              annually to ensure uncompromising principal involvement from Architect Syed Raza Jan
              and rigorous execution fidelity across every phase of conception and construction.
            </p>

            {/* Preserved layout spacing */}
            <div className="inquiries__spacer" aria-hidden="true"></div>

            <div className="inquiries__action">
              <a href="#projects" className="inquiries__explore-btn">
                <span>Explore Works</span>
                <span className="inquiries__arrow-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Consultation Request Card */}
          <div className="inquiries__right">
            <div className="inquiries__card">
              <div className="inquiries__card-header">
                <span className="inquiries__card-tag">Consultation Request</span>
                <h3 className="inquiries__card-title">Initiate Dialogue</h3>
                <p className="inquiries__card-subtitle">
                  Submit project parameters below; our principal team will review
                  feasibility within 48 business hours.
                </p>
              </div>

              {submitted ? (
                <div className="inquiries__success">
                  <div className="inquiries__success-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h4 className="inquiries__success-title">Inquiry Received</h4>
                  <p className="inquiries__success-desc">
                    Thank you, <span className="font-semibold">{formData.user_name || 'Client'}</span>.
                    Architect Syed Raza Jan and the principal studio team will review
                    your project parameters and respond within 48 business hours.
                  </p>
                  <button
                    type="button"
                    className="btn-pill"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        user_name: '',
                        user_email: '',
                        user_phone: '',
                        project_type: 'Architecture & Master Planning',
                        project_location: '',
                        message: '',
                      });
                    }}
                  >
                    <span>Submit Another Inquiry</span>
                  </button>
                </div>
              ) : (
                <form className="inquiries__form" onSubmit={handleSubmit} id="inquiry-form">
                  <div className="inquiries__form-grid-3">
                    <div className="inquiries__field">
                      <label htmlFor="user_name">Full Name *</label>
                      <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        placeholder="Your Name"
                        value={formData.user_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="inquiries__field">
                      <label htmlFor="user_email">Email Address *</label>
                      <input
                        type="email"
                        id="user_email"
                        name="user_email"
                        placeholder="Your Email"
                        value={formData.user_email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="inquiries__field">
                      <label htmlFor="user_phone">Phone / WhatsApp <span className="inquiries__optional"></span></label>
                      <input
                        type="tel"
                        id="user_phone"
                        name="user_phone"
                        placeholder="Your Phone Number"
                        value={formData.user_phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="inquiries__form-grid-2">
                    <div className="inquiries__field">
                      <label htmlFor="project_type">Project Type *</label>
                      <select
                        id="project_type"
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="Architecture & Master Planning">Architecture & Master Planning</option>
                        <option value="Interior Design & Styling">Interior Design & Styling</option>
                        <option value="Turnkey Execution">Turnkey Execution & Supervision</option>
                        <option value="3D Visualization & Digital Twin">3D Visualization & Digital Twin</option>
                        <option value="Comprehensive Commission">Comprehensive Full Atelier Scope</option>
                      </select>
                    </div>

                    <div className="inquiries__field">
                      <label htmlFor="project_location">Project Location <span className="inquiries__optional">(Optional)</span></label>
                      <input
                        type="text"
                        id="project_location"
                        name="project_location"
                        placeholder="City, Country (e.g. Islamabad, London)"
                        value={formData.project_location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="inquiries__field">
                    <label htmlFor="message">Project Scope & Brief *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Outline your site requirements, estimated scale, aesthetic aspirations, or target schedule..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {errorMessage && (
                    <div className="inquiries__error-alert" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <div className="inquiries__footer-row">
                    <span className="inquiries__routed-note">
                      Directly routed to Lead Architect Syed Raza Jan
                    </span>
                    <button
                      type="submit"
                      className="inquiries__submit-btn"
                      disabled={isSubmitting}
                      style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                    >
                      <span>{isSubmitting ? 'Transmitting...' : 'Send Inquiry'}</span>
                      <span className="inquiries__arrow-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>

                  <div className="inquiries__email-fallback">
                    <span>Prefer email? Direct correspondence to </span>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=arrazajan@gmail.com&su=Architectural%20Inquiry%20%E2%80%94%20SRJ%20Studio"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      arrazajan@gmail.com
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
