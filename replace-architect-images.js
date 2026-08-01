const fs = require('fs');

const arch1 = 'src/components/ArchitectsClient.tsx';
if (fs.existsSync(arch1)) {
  let content = fs.readFileSync(arch1, 'utf8');
  if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
  }
  content = content.replace(
    /<img src=\{arch\.shopImageUrl\} alt=\{arch\.companyName \|\| arch\.name\} className="w-full h-full object-cover" \/>/g,
    '<Image src={arch.shopImageUrl || "/contractor.jpeg"} alt={arch.companyName || arch.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />'
  );
  fs.writeFileSync(arch1, content);
}

const arch2 = 'src/components/ArchitectsPageClient.tsx';
if (fs.existsSync(arch2)) {
  let content = fs.readFileSync(arch2, 'utf8');
  if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
  }
  content = content.replace(
    /<img src=\{architect\.shopImageUrl \? getFileUrl\(architect\.shopImageUrl\) : "\/architect\.png"\} alt=\{`\$\{architect\.name\} banner`\} className="absolute inset-0 w-full h-full object-cover" \/>/g,
    '<Image src={architect.shopImageUrl ? getFileUrl(architect.shopImageUrl) : "/architect.png"} alt={`${architect.name} banner`} fill className="object-cover" sizes="100vw" priority />'
  );
  fs.writeFileSync(arch2, content);
}

console.log('Optimized Architects pages');
