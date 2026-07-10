"use client";

import { useEffect, useState, useRef } from "react";
import { X, Calendar, MapPin, Clock, Ticket, ChevronRight } from "lucide-react";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
// import Barcode from "react-barcode";

// ─── Mock data – replace with real API call ───────────────────────────────────
type TicketItem = {
  id: string;
  registrationId: string;
  eventName: string;
  venue: string;
  date: string; // ISO string
  time: string;
  category: string;
  isExpired: boolean;
  color: string; // accent color per ticket
};
const CATEGORY_COLORS: Record<string, string> = {
  Technical: "#a855f7", // purple-500  (your existing)
  Cultural: "#ec4899", // pink-500    (your existing)
  Networking: "#e879f9", // fuchsia-400 ← new
  Sports: "#fb7185", // rose-400    ← new
  Other: "#f43f5e", // rose-500    ← new
};
const MOCK_TICKETS: TicketItem[] = [
  {
    id: "1",
    registrationId: "REG-2025-001-ABCD",
    eventName: "TechFest 2025",
    venue: "Auditorium A, Block 5",
    date: "2025-08-15T00:00:00",
    time: "10:00 AM",
    category: "Technical",
    isExpired: false,
    color: "#a855f7",
  },
  {
    id: "2",
    registrationId: "REG-2025-002-EFGH",
    eventName: "Cultural Night",
    venue: "Open Air Theatre",
    date: "2025-07-20T00:00:00",
    time: "7:00 PM",
    category: "Cultural",
    isExpired: false,
    color: "#ec4899",
  },
  {
    id: "3",
    registrationId: "REG-2024-099-WXYZ",
    eventName: "Hackathon Spring '24",
    venue: "Innovation Lab",
    date: "2024-03-10T00:00:00",
    time: "9:00 AM",
    category: "Technical",
    isExpired: true,
    color: "#6366f1",
  },
  {
    id: "4",
    registrationId: "REG-2025-003-IJKL",
    eventName: "Alumni Meet 2025",
    venue: "Conference Hall B",
    date: "2025-09-05T00:00:00",
    time: "11:00 AM",
    category: "Networking",
    isExpired: false,
    color: "#0ea5e9",
  },
  {
    id: "5",
    registrationId: "REG-2024-077-MNOP",
    eventName: "Sports Day 2024",
    venue: "Main Ground",
    date: "2024-11-22T00:00:00",
    time: "8:00 AM",
    category: "Sports",
    isExpired: true,
    color: "#10b981",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [isloading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [openedOnce, setOpenedOnce] = useState<Set<string>>(new Set());
  const [animating, setAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Replace this with your real API call
  useEffect(() => {
    try {
      fetchTicket().then(() => {
        setLoading(false)
      })
    } catch (err) {
      console.log("Failed to Fetch Tickets");
      setTickets([])
      setLoading(false)
    }
  }, []);
  const fetchTicket = async () => {
    const res = await fetch("/api/tickets");
    const { tickets } = await res.json();

    // Map to TicketItem shape
    setTickets(tickets.map((t: any) => ({
      id: t.registrationId,
      registrationId: t.registrationId,
      eventName: t.event.title,
      venue: t.event.location,
      date: t.event.date,
      time: new Date(t.event.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      category: t.event.category,
      isExpired: t.isExpired,
      color: CATEGORY_COLORS[t.event.category] ?? "#a855f7", // optional map
    })));
  }
  const openTicket = (ticket: TicketItem) => {
    const isFirstTime = !openedOnce.has(ticket.id);
    setSelectedTicket(ticket);
    if (isFirstTime) {
      setAnimating(true);
      setOpenedOnce((prev) => new Set(prev).add(ticket.id));
      setTimeout(() => setAnimating(false), 400);
    }
  };

  const closeTicket = () => {
    setSelectedTicket(null);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <style>{CSS}</style>

      <div className="min-h-screen w-full py-8 px-4 sm:px-6 lg:px-8">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-purple-600" />
            Your Tickets
          </h1>
          <p className="text-gray-500 text-sm">
            {tickets.filter((t) => !t.isExpired).length} active ·{" "}
            {tickets.filter((t) => t.isExpired).length} expired
          </p>
        </div>

        {isloading ? (
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
              <p className="text-gray-500 text-sm">Fetching your tickets…</p>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <Ticket className="w-16 h-16 opacity-30" />
            <p className="text-lg font-medium">No tickets yet</p>
            <p className="text-sm">Register for events to see your tickets here.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {tickets.map((ticket, i) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                index={i}
                onOpen={openTicket}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Overlay ──────────────────────────────────────── */}
      {selectedTicket && (
        <div
          className="ticket-overlay"
          onClick={(e) => e.target === e.currentTarget && closeTicket()}
        >
          <div
            ref={modalRef}
            className={`ticket-modal ${animating ? "ticket-float-in" : "ticket-modal-open"}`}
          >
            <TicketPopup ticket={selectedTicket} onClose={closeTicket} />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Ticket Card ──────────────────────────────────────────────────────────────
function TicketCard({
  ticket,
  index,
  onOpen,
}: {
  ticket: TicketItem;
  index: number;
  onOpen: (t: TicketItem) => void;
}) {
  const expired = ticket.isExpired;

  return (
    <>
      {/* ── MOBILE: flat compact card ───────────────────────── */}
      <button
        onClick={() => onOpen(ticket)}
        className="sm:hidden w-full text-left"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div
          className={`mobile-ticket-card ${expired ? "expired" : ""}`}
          style={{ "--accent": ticket.color } as React.CSSProperties}
        >
          <span
            className="mobile-ticket-dot"
            style={{ background: ticket.color }}
          />
          <span className="mobile-ticket-name">{ticket.eventName}</span>
          {expired && (
            <span className="mobile-ticket-badge">Expired</span>
          )}
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>
      </button>

      {/* ── DESKTOP: full card ──────────────────────────────── */}
      <button
        onClick={() => onOpen(ticket)}
        className="hidden sm:block w-full text-left ticket-card-enter"
        style={{ animationDelay: `${index * 70}ms` }}
      >
        <div
          className={`desktop-ticket-card ${expired ? "expired" : ""}`}
          style={{ "--accent": ticket.color } as React.CSSProperties}
        >
          {/* Top color strip */}
          <div
            className="ticket-strip"
            style={{ background: expired ? "#9ca3af" : ticket.color }}
          />

          {/* Tear line */}
          <div className="tear-line">
            <div className="tear-circle left" />
            <div className="tear-dashes" />
            <div className="tear-circle right" />
          </div>

          {/* Body */}
          <div className="ticket-body">
            <div className="ticket-category">{ticket.category}</div>
            <h3 className="ticket-event-name">{ticket.eventName}</h3>

            <div className="ticket-meta">
              <span className="ticket-meta-item">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(ticket.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="ticket-meta-item">
                <Clock className="w-3.5 h-3.5" />
                {ticket.time}
              </span>
              <span className="ticket-meta-item col-span-2">
                <MapPin className="w-3.5 h-3.5" />
                {ticket.venue}
              </span>
            </div>
          </div>

          {expired && (
            <div className="expired-stamp">EXPIRED</div>
          )}
        </div>
      </button>
    </>
  );
}

// ─── Ticket Popup ─────────────────────────────────────────────────────────────
function TicketPopup({
  ticket,
  onClose,
}: {
  ticket: TicketItem;
  onClose: () => void;
}) {
  const expired = ticket.isExpired;

  return (
    <div
      className={`popup-ticket ${expired ? "popup-expired" : ""}`}
      style={{ "--accent": ticket.color } as React.CSSProperties}
    >
      {/* Close */}
      <button onClick={onClose} className="popup-close">
        <X className="w-4 h-4" />
      </button>

      {/* Header strip */}
      <div
        className="popup-header"
        style={{ background: expired ? "#6b7280" : ticket.color }}
      >
        <span className="popup-category">{ticket.category}</span>
        <h2 className="popup-event-name">{ticket.eventName}</h2>
      </div>

      {/* Tear line */}
      <div className="popup-tear">
        <div className="tear-circle left" />
        <div className="popup-tear-dashes" />
        <div className="tear-circle right" />
      </div>

      {/* Details */}
      <div className="popup-details">
        <div className="popup-detail-row">
          <Calendar className="w-4 h-4 text-purple-500" />
          <div>
            <div className="popup-detail-label">Date</div>
            <div className="popup-detail-value">
              {new Date(ticket.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
        <div className="popup-detail-row">
          <Clock className="w-4 h-4 text-purple-500" />
          <div>
            <div className="popup-detail-label">Time</div>
            <div className="popup-detail-value">{ticket.time}</div>
          </div>
        </div>
        <div className="popup-detail-row">
          <MapPin className="w-4 h-4 text-purple-500" />
          <div>
            <div className="popup-detail-label">Venue</div>
            <div className="popup-detail-value">{ticket.venue}</div>
          </div>
        </div>
      </div>

      {/* Barcode section */}
      <div className="popup-barcode-section">
        <div className="popup-reg-label">Registration ID</div>
        <div className="popup-reg-id">{ticket.registrationId}</div>

        {/* ── Swap the comment block below when react-barcode is installed ── */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <QRCodeSVG
            value={ticket.registrationId || " "}
            size={100}
            // fgColor={fgColor}
            // bgColor={bgColor}
            level="H" // High error correction (recommended for custom styling)
          />
        </div>

        {/* Placeholder barcode (remove once react-barcode is added) */}
        {/* <div className="barcode-placeholder" aria-hidden="true">
          {Array.from({ length: 42 }).map((_, i) => (
            <div
              key={i}
              className="barcode-bar"
              style={{
                width: [1, 2, 1, 3, 1, 2][i % 6],
                height: i % 5 === 0 ? 60 : 48,
                background: expired ? "#9ca3af" : "#1f2937",
              }}
            />
          ))}
        </div> */}

        {expired && (
          <div className="popup-expired-badge">This ticket has expired</div>
        )}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
/* ── Keyframes ─────────────────────────────────────────────────────────── */
@keyframes ticketFloatIn {
  0%   { opacity: 0; transform: translateY(-40px) rotate(-4deg) scale(0.88); }
  55%  { opacity: 1; transform: translateY(6px)  rotate(1.2deg) scale(1.02); }
  78%  { transform: translateY(-3px) rotate(-0.5deg) scale(0.99); }
  100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
}

@keyframes ticketModalOpen {
  0%   { opacity: 0; transform: scale(0.94) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes cardEnter {
  0%   { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes overlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Overlay ───────────────────────────────────────────────────────────── */
.ticket-overlay {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: overlayIn 0.18s ease forwards;
}

.ticket-float-in  { animation: ticketFloatIn  0.4s cubic-bezier(.34,1.56,.64,1) forwards; }
.ticket-modal-open { animation: ticketModalOpen 0.22s ease forwards; }

.ticket-card-enter {
  animation: cardEnter 0.35s ease both;
  opacity: 0;
}

/* ── Mobile card ──────────────────────────────────────────────────────── */
.mobile-ticket-card {
  display: flex; align-items: center; gap: 10px;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-left: 4px solid var(--accent);
  border-radius: 10px;
  padding: 12px 14px;
  transition: background 0.15s, transform 0.1s;
}
.mobile-ticket-card:active { transform: scale(0.98); background: #f9fafb; }
.mobile-ticket-card.expired { filter: grayscale(1); opacity: 0.55; }
.mobile-ticket-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.mobile-ticket-name {
  flex: 1; font-weight: 600; font-size: 0.875rem; color: #111827;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mobile-ticket-badge {
  font-size: 0.65rem; font-weight: 700; color: #6b7280;
  background: #f3f4f6; border-radius: 4px; padding: 1px 6px;
  text-transform: uppercase; letter-spacing: 0.05em;
  flex-shrink: 0;
}

/* ── Desktop card ─────────────────────────────────────────────────────── */
.desktop-ticket-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}
.desktop-ticket-card:hover {
  box-shadow: 0 8px 28px rgba(0,0,0,0.13);
  transform: translateY(-2px);
}
.desktop-ticket-card:active { transform: translateY(0) scale(0.98); }
.desktop-ticket-card.expired { filter: grayscale(1); opacity: 0.55; }

.ticket-strip { height: 6px; width: 100%; }

.tear-line {
  display: flex; align-items: center; padding: 0 0;
  position: relative; margin: 0;
}
.tear-circle {
  width: 16px; height: 16px; border-radius: 50%;
  background: #f3f4f6; flex-shrink: 0;
  position: absolute;
}
.tear-circle.left  { left: -8px; }
.tear-circle.right { right: -8px; }
.tear-dashes {
  flex: 1; margin: 0 16px;
  border-top: 1.5px dashed #e5e7eb;
}

.ticket-body { padding: 14px 18px 16px; }
.ticket-category {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--accent); margin-bottom: 4px;
}
.ticket-event-name {
  font-size: 1rem; font-weight: 700; color: #111827;
  line-height: 1.3; margin-bottom: 10px;
}
.ticket-meta {
  display: grid; grid-template-columns: 1fr 1fr; gap: 5px 8px;
}
.ticket-meta-item {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.72rem; color: #6b7280;
}

.expired-stamp {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%) rotate(-20deg);
  font-size: 1.4rem; font-weight: 900; letter-spacing: 0.18em;
  color: #d1d5db; border: 3px solid #d1d5db; border-radius: 6px;
  padding: 4px 12px; pointer-events: none; opacity: 0.6;
  white-space: nowrap;
}

/* ── Popup ticket ─────────────────────────────────────────────────────── */
.popup-ticket {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  width: 80vw;
  box-shadow: 0 24px 60px rgba(0,0,0,0.25);
  position: relative;
  filter: brightness(1.04);
}
.popup-ticket.popup-expired {
  filter: grayscale(1) brightness(0.95);
}

.popup-close {
  position: absolute; top: 12px; right: 12px; z-index: 10;
  background: rgba(255,255,255,0.25); border: none;
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: white;
  backdrop-filter: blur(4px);
  transition: background 0.15s;
}
.popup-close:hover { background: rgba(255,255,255,0.4); }

.popup-header {
  padding: 22px 22px 16px;
  color: white;
}
.popup-category {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; opacity: 0.85;
}
.popup-event-name {
  font-size: 1.35rem; font-weight: 800; line-height: 1.25; margin-top: 4px;
}

.popup-tear {
  display: flex; align-items: center; background: white;
  position: relative; height: 0;
}
.popup-tear-dashes {
  flex: 1; margin: 0 16px;
  border-top: 1.5px dashed #e5e7eb;
}

.popup-details {
  padding: 20px 22px 14px;
  display: flex; flex-direction: column; gap: 12px;
}
.popup-detail-row {
  display: flex; align-items: flex-start; gap: 10px;
}
.popup-detail-label {
  font-size: 0.68rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.06em; color: #9ca3af; margin-bottom: 1px;
}
.popup-detail-value {
  font-size: 0.875rem; font-weight: 600; color: #1f2937;
}

.popup-barcode-section {
  padding: 0 22px 22px;
  border-top: 1.5px dashed #e5e7eb;
  margin-top: 6px; padding-top: 16px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.popup-reg-label {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: #9ca3af;
}
.popup-reg-id {
  font-size: 0.78rem; font-weight: 600; color: #374151;
  letter-spacing: 0.04em; margin-bottom: 4px;
}

/* Barcode placeholder */
.barcode-placeholder {
  display: flex; align-items: flex-end; gap: 1.5px;
  height: 64px;
}
.barcode-bar {
  border-radius: 1px;
  flex-shrink: 0;
}

.popup-expired-badge {
  margin-top: 6px;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: #9ca3af;
  background: #f3f4f6; border-radius: 6px; padding: 4px 10px;
}
`;