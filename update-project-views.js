const fs = require('fs');
const file = 'src/components/ProjectDetailPageClient.tsx';
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
  fs.writeFileSync(file, code);
}
console.log('ProjectDetail updated');
