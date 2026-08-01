const fs = require('fs');

const proj1 = 'src/components/professional/ProjectsPage.tsx';
if (fs.existsSync(proj1)) {
  let content = fs.readFileSync(proj1, 'utf8');
  if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
  }
  content = content.replace(
    /<img src=\{sample\.imageUrl\.startsWith\("http"\) \? sample\.imageUrl : `\$\{process\.env\.NEXT_PUBLIC_BACKEND_URL\}\/\$\{sample\.imageUrl\}`\} className="w-full h-full object-cover" alt="" \/>/g,
    '<Image src={sample.imageUrl.startsWith("http") ? sample.imageUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${sample.imageUrl}`} alt="Project" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />'
  );
  content = content.replace(
    /<img src=\{URL\.createObjectURL\(sample\.imageFiles\[0\]\)\} className="w-full h-full object-cover" alt="" \/>/g,
    '<Image src={URL.createObjectURL(sample.imageFiles[0])} alt="Project Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />'
  );
  content = content.replace(
    /<img src=\{URL\.createObjectURL\(file\)\} className="w-full h-full object-cover" alt="" \/>/g,
    '<Image src={URL.createObjectURL(file)} alt="File Preview" fill className="object-cover" sizes="100px" />'
  );
  content = content.replace(
    /<img src=\{tempProject\.imageUrl\.startsWith\("http"\) \? tempProject\.imageUrl : `\$\{process\.env\.NEXT_PUBLIC_BACKEND_URL\}\/\$\{tempProject\.imageUrl\}`\} className="w-full h-full object-cover" alt="" \/>/g,
    '<Image src={tempProject.imageUrl.startsWith("http") ? tempProject.imageUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${tempProject.imageUrl}`} alt="Project Preview" fill className="object-cover" sizes="100px" />'
  );
  fs.writeFileSync(proj1, content);
}

console.log('Optimized Professional Projects page');
