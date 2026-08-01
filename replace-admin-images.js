const fs = require('fs');

const admin1 = 'src/components/admin/ContractorProjectsPage.tsx';
if (fs.existsSync(admin1)) {
  let content = fs.readFileSync(admin1, 'utf8');
  if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
  }
  content = content.replace(
    /<img[\s\S]*?src=\{`\$\{process\.env\.NEXT_PUBLIC_BACKEND_URL\}\/\$\{project\.imageUrl\}`\}[\s\S]*?className="w-full h-full object-cover"[\s\S]*?alt="Project"[\s\S]*?\/>/g,
    '<Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${project.imageUrl}`} alt="Project" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />'
  );
  fs.writeFileSync(admin1, content);
}

const admin2 = 'src/components/admin/ContractorSEOPage.tsx';
if (fs.existsSync(admin2)) {
  let content = fs.readFileSync(admin2, 'utf8');
  if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
  }
  content = content.replace(
    /<img src=\{`\$\{process\.env\.NEXT_PUBLIC_BACKEND_URL\}\/\$\{project\.imageUrl\}`\} className="w-full h-full object-cover" alt="Project" \/>/g,
    '<Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${project.imageUrl}`} alt="Project" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />'
  );
  fs.writeFileSync(admin2, content);
}

console.log('Optimized Admin pages');
