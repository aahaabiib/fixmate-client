// PDF shudhu browser e toiri hoy. jspdf click korar shomoy load hoy (dynamic import).

const NAVY = [11, 29, 58];
const ORANGE = [249, 115, 22];
const DARK = [15, 23, 42];
const GRAY = [100, 116, 139];
const LIGHT = [241, 245, 249];

function money(value, currency = "usd") {
  const n = Number(value) || 0;
  return currency.toLowerCase() === "usd"
    ? `$${n.toFixed(2)}`
    : `${n.toFixed(2)} ${currency.toUpperCase()}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function downloadInvoice({ payment, booking }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  const right = W - M;

  const invoiceNo = `INV-${String(payment.bookingId).slice(-8).toUpperCase()}`;

  // ---------- Header ----------
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 110, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text("Fix", M, 62);
  const fixWidth = doc.getTextWidth("Fix");
  doc.setTextColor(...ORANGE);
  doc.text("Mate", M + fixWidth, 62);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text("Smart device & home appliance repair", M, 82);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("INVOICE", right, 62, { align: "right" });

  // ---------- Billed to / details ----------
  let y = 160;
  const colX = W / 2 + 20;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...ORANGE);
  doc.text("BILLED TO", M, y);
  doc.text("INVOICE DETAILS", colX, y);

  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text(payment.customerName || "Customer", M, y + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text(payment.customerEmail || "", M, y + 36);
  if (booking?.customerPhone) doc.text(booking.customerPhone, M, y + 50);
  if (booking?.address) {
    const addr = doc.splitTextToSize(booking.address, W / 2 - M - 20);
    doc.text(addr.slice(0, 2), M, y + (booking?.customerPhone ? 64 : 50));
  }

  const detail = (label, value, offset) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text(label, colX, y + offset);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(String(value), right - colX - 80);
    doc.text(lines, colX + 80, y + offset);
  };
  detail("Invoice no", invoiceNo, 20);
  detail("Date paid", formatDate(payment.paidAt), 36);
  detail("Transaction", payment.transactionId || "-", 52);

  // ---------- Table ----------
  y = 275;
  doc.setFillColor(...LIGHT);
  doc.rect(M, y, right - M, 30, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text("SERVICE", M + 12, y + 19);
  doc.text("TECHNICIAN", M + 290, y + 19);
  doc.text("AMOUNT", right - 12, y + 19, { align: "right" });

  y += 56;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  const titleLines = doc.splitTextToSize(payment.serviceTitle || "Repair service", 250);
  doc.text(titleLines, M + 12, y);

  let sub = y + titleLines.length * 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  if (booking?.category) {
    doc.text(booking.category, M + 12, sub);
    sub += 13;
  }
  if (booking?.preferredDate) {
    doc.text(`Preferred date: ${booking.preferredDate}`, M + 12, sub);
    sub += 13;
  }

  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text(payment.technicianName || "-", M + 290, y);
  doc.setFont("helvetica", "bold");
  doc.text(money(payment.amount, payment.currency), right - 12, y, {
    align: "right",
  });

  const lineY = Math.max(sub, y + 20) + 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(M, lineY, right, lineY);

  // ---------- Total ----------
  const totalY = lineY + 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text("Subtotal", right - 180, totalY);
  doc.setTextColor(...DARK);
  doc.text(money(payment.amount, payment.currency), right - 12, totalY, {
    align: "right",
  });

  doc.setFillColor(...NAVY);
  doc.roundedRect(right - 200, totalY + 16, 200, 44, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text("TOTAL PAID", right - 186, totalY + 43);
  doc.setFontSize(15);
  doc.setTextColor(...ORANGE);
  doc.text(money(payment.amount, payment.currency), right - 12, totalY + 43, {
    align: "right",
  });

  // ---------- PAID badge ----------
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(2);
  doc.roundedRect(M, totalY + 16, 90, 44, 6, 6, "S");
  doc.setFontSize(18);
  doc.setTextColor(22, 163, 74);
  doc.text("PAID", M + 45, totalY + 45, { align: "center" });

  // ---------- Footer ----------
  doc.setLineWidth(1);
  doc.setDrawColor(226, 232, 240);
  doc.line(M, 770, right, 770);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text("Thank you for choosing FixMate.", W / 2, 790, { align: "center" });
  doc.text(
    "This invoice is computer generated and needs no signature.",
    W / 2,
    804,
    { align: "center" }
  );

  doc.save(`FixMate-${invoiceNo}.pdf`);
}