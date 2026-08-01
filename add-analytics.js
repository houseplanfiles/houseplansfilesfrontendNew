const fs = require('fs');

const files = [
  'src/components/CityPartnersPageClient.tsx',
  'src/components/HomeDesigningClient.tsx',
  'src/components/IndustrialServicesClient.tsx',
  'src/components/OtherServicesClient.tsx',
  'src/components/ConstructionPartnersSection.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // Ensure import
  if (!code.includes('import { trackAnalytics }')) {
    code = code.replace(/import \{[^}]+\} from ["']lucide-react["'];/, match => match + '\nimport { trackAnalytics } from "@/lib/analytics";');
  }

  // Update onClick for WhatsApp Premium
  code = code.replace(
    /onClick=\{\(\) => window\.open\(waLink, "_blank"\)\}/g,
    `onClick={() => { trackAnalytics('user', partner._id, 'contact'); window.open(waLink, "_blank"); }}`
  );

  // Update onClick for Call Now Premium
  code = code.replace(
    /onClick=\{\(\) => window\.location\.href = callLink\}/g,
    `onClick={() => { trackAnalytics('user', partner._id, 'contact'); window.location.href = callLink; }}`
  );

  // Update onClick for Enquiry Now Normal
  code = code.replace(
    /onClick=\{\(\) => onContact\(partner\)\}/g,
    `onClick={() => { trackAnalytics('user', partner._id, 'contact'); onContact(partner); }}`
  );

  fs.writeFileSync(file, code);
});

console.log('Done adding analytics to buttons');
