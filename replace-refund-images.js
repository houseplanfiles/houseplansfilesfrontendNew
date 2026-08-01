const fs = require('fs');

const file = 'src/components/RefundPolicyClient.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
  }
  content = content.replace(
    /<img[\s\S]*?src="\/logo1\.png"[\s\S]*?alt="HousePlanFiles Logo"[\s\S]*?className="h-12 w-auto"[\s\S]*?\/>/g,
    '<Image src="/logo1.png" alt="HousePlanFiles Logo" width={200} height={48} className="h-12 w-auto object-contain" />'
  );
  fs.writeFileSync(file, content);
}

console.log('Optimized Refund Policy page');
