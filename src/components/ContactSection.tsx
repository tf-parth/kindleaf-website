"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Facebook } from 'lucide-react';

interface ContactSectionProps {
  settings?: {
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    whatsapp_phone?: string;
    facebook_url?: string;
  };
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const email = settings?.contact_email || "support@kindleaf.in";
  const phone = settings?.contact_phone || "+91 6396461480";
  const address = settings?.address || "Vill. Katoora, post darapur milawali, jasrana firozabad 283136, Uttar Pradesh";
  const whatsapp = settings?.whatsapp_phone || "916396461480";
  const facebook = (settings?.facebook_url && settings.facebook_url !== "https://facebook.com")
    ? settings.facebook_url
    : "https://www.facebook.com/share/1EELT4gBjW/";

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#0a150f] border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-gold text-xs font-semibold uppercase tracking-widest block mb-2">
                Connect With Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#F8F6F2] mb-4">
                We’d Love to Hear <br />
                <span className="text-gold italic font-normal">From You</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Whether you have questions about our botanical blend, brewing recommendations, media inquiries, or general feedback, our small team in Jasrana is here to help.
              </p>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#163322]/25 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Email Desk</span>
                  <a href={`mailto:${email}`} className="text-[#F8F6F2] hover:text-gold transition-colors font-medium">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#163322]/25 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Phone &amp; WhatsApp</span>
                  <a href={`https://api.whatsapp.com/send?phone=${whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[#F8F6F2] hover:text-gold transition-colors font-medium">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#163322]/25 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Registered Office</span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#163322]/25 border border-white/10 hover:border-gold/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                  <Facebook size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Facebook Page</span>
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-[#F8F6F2] hover:text-gold transition-colors font-medium inline-flex items-center gap-1.5">
                    <span>Kindleaf on Facebook</span>
                    <span className="text-xs text-gold">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiries Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
              <h3 className="text-xl font-serif text-[#F8F6F2] font-bold mb-2">
                Send an Inquiry or Message
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Fill out the message form below and our team will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-[#163322]/40 border border-gold/30 rounded-2xl space-y-3">
                  <CheckCircle2 size={40} className="text-gold mx-auto" />
                  <h4 className="font-serif font-bold text-lg text-[#F8F6F2]">
                    Thank you for reaching out!
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    We have received your message and will respond to <span className="text-gold">{senderEmail}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setSenderEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="mt-4 text-xs text-gold underline hover:text-gold-hover cursor-pointer"
                  >
                    Send another note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gaurav Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold/60"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Question about brewing / Botanical details"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold/60"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Send Message</span>
                    <Send size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
