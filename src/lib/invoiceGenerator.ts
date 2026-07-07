import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateInvoicePDF = (order: any, user: any) => {
  const doc = new jsPDF();
  
  // Set fonts, styling
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(234, 88, 12); // #ea580c (Orange)
  doc.text("HOUSEPLANFILES", 14, 20);
  
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(100);
  doc.text("Email: support@houseplanfiles.com", 14, 26);
  doc.text("Website: www.houseplanfiles.com", 14, 31);
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("TAX INVOICE", 140, 20);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  
  const shortId = order._id ? order._id.substring(order._id.length - 6).toUpperCase() : Math.floor(100000 + Math.random() * 900000);
  doc.text(`Invoice No: INV-${shortId}`, 140, 26);
  doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN")}`, 140, 31);
  
  // Line separator
  doc.setDrawColor(200);
  doc.line(14, 38, 196, 38);
  
  // Bill To details
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("BILL TO:", 14, 46);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Name: ${user.name || user.businessName || "Customer"}`, 14, 52);
  doc.text(`Email: ${user.email || ""}`, 14, 57);
  doc.text(`Phone: ${user.phone || ""}`, 14, 62);
  
  // Table columns and rows
  const tableColumn = ["#", "Item Description", "Unit Price (INR)"];
  const tableRows: any[] = [];
  
  const items = order.orderItems || [];
  items.forEach((item: any, index: number) => {
    tableRows.push([
      index + 1,
      item.name,
      `INR ${Number(item.price).toFixed(2)}`
    ]);
  });
  
  // Autotable
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 70,
    theme: "striped",
    headStyles: { fillColor: [234, 88, 12] }, // orange color
    styles: { fontSize: 10 },
  });
  
  // Calculate position after table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Subtotal, GST, and Total
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(80);
  doc.text(`Subtotal:`, 140, finalY);
  doc.text(`INR ${Number(order.itemsPrice || 0).toFixed(2)}`, 175, finalY);
  
  doc.text(`GST (18%):`, 140, finalY + 5);
  doc.text(`INR ${Number(order.taxPrice || 0).toFixed(2)}`, 175, finalY + 5);
  
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(0);
  doc.text(`Total Paid:`, 140, finalY + 12);
  doc.text(`INR ${Number(order.totalPrice || 0).toFixed(2)}`, 175, finalY + 12);
  
  // Footer
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Thank you for choosing Houseplanfiles!", 14, finalY + 25);
  doc.text("This is a computer generated invoice and does not require a physical signature.", 14, finalY + 30);
  
  // Save PDF
  doc.save(`invoice_${order._id || "subscription"}.pdf`);
};
