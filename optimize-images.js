const fs = require('fs');

function replaceImgWithNextImage(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ensure next/image is imported
  if (!content.includes('import Image from "next/image"') && !content.includes("import Image from 'next/image'")) {
    content = 'import Image from "next/image";\n' + content;
  }

  // Replace <img ... className="w-full h-full object-cover"... />
  // with <Image src={...} fill className="object-cover"... />
  // This is a bit tricky with regex, so we'll do specific replacements.

  if (filePath.includes('ConstructionPartnersSection.tsx')) {
    content = content.replace(
      /<img src=\{getImageUrl\(partner\.shopImageUrl\)\} alt=\{partner\.companyName\} className="w-full h-full object-cover" loading="lazy" \/>/g,
      `<Image src={getImageUrl(partner.shopImageUrl)} alt={partner.companyName || 'Shop Image'} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />`
    );
    content = content.replace(
      /<img src="https:\/\/images\.unsplash\.com\/photo-1541888946425-d81bb19240f5\?auto=format&fit=crop&q=80" alt="bg" className="w-full h-full object-cover" loading="lazy" \/>/g,
      `<Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80" alt="bg" fill className="object-cover" priority sizes="100vw" />`
    );
  }

  if (filePath.includes('Footer.tsx')) {
    content = content.replace(/<img /g, '<Image ');
  }

  fs.writeFileSync(filePath, content);
}

replaceImgWithNextImage('src/components/ConstructionPartnersSection.tsx');
replaceImgWithNextImage('src/components/Footer.tsx');
console.log('Optimized images in a few components');
