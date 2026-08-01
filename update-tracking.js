const fs = require('fs');

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const regexWhatsApp = /trackAnalytics\('user',\s*([^,]+),\s*'contact'\);\s*window\.open\(waLink/g;
  if (regexWhatsApp.test(content)) {
    content = content.replace(regexWhatsApp, "trackAnalytics('user', $1, 'whatsapp_click'); window.open(waLink");
    changed = true;
  }

  const regexCall = /trackAnalytics\('user',\s*([^,]+),\s*'contact'\);\s*window\.location\.href\s*=\s*callLink/g;
  if (regexCall.test(content)) {
    content = content.replace(regexCall, "trackAnalytics('user', $1, 'call_click'); window.location.href = callLink");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Updated:', filePath);
  }
}

const files = [
  'src/components/CityPartnersPageClient.tsx',
  'src/components/ConstructionPartnersSection.tsx',
  'src/components/HomeDesigningClient.tsx',
  'src/components/IndustrialServicesClient.tsx',
  'src/components/OtherServicesClient.tsx'
];

files.forEach(updateFile);

const profilePath = 'src/components/ContractorProfilePageClient.tsx';
if (fs.existsSync(profilePath)) {
  let content = fs.readFileSync(profilePath, 'utf8');
  
  content = content.replace(
    /onClick=\{\(\) => window\.open\(`https:\/\/wa\.me/g,
    `onClick={() => { trackAnalytics('user', contractor._id, 'whatsapp_click'); window.open(\`https://wa.me`
  );
  // for the call link
  content = content.replace(
    /onClick=\{\(\) => window\.location\.href = `tel:\$\{contractor\.phone\}`\}/g,
    `onClick={() => { trackAnalytics('user', contractor._id, 'call_click'); window.location.href = \`tel:\${contractor.phone}\`; }}`
  );
  
  // Note: the original replacement might miss the closing `}` if it was a simple lambda.
  // The first replace adds a `{` so the lambda body is a block, but the end of the line will just be `", "_blank");` which would leave a missing `}`
  // Let's use string replace directly with the exact line.
}
