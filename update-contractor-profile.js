const fs = require('fs');
const file = 'src/components/ContractorProfilePageClient.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('trackAnalytics')) {
  code = code.replace(
    /import \{ toast \} from "sonner";/,
    'import { toast } from "sonner";\nimport { trackAnalytics } from "@/lib/analytics";'
  );

  code = code.replace(
    /setContractor\(data\);/,
    "setContractor(data);\n        trackAnalytics('user', id, 'view');"
  );
  
  // also track whatsapp clicks here
  code = code.replace(
    /onClick=\{\(\) => window\.open\(waLink, "_blank"\)\}/g,
    `onClick={() => { trackAnalytics('user', id, 'contact'); window.open(waLink, "_blank"); }}`
  );
  
  fs.writeFileSync(file, code);
}
console.log('ContractorProfile updated');
