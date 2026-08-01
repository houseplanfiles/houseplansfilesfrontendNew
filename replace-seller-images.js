const fs = require('fs');

const seller1 = 'src/components/SellersSection.tsx';
if (fs.existsSync(seller1)) {
  let content = fs.readFileSync(seller1, 'utf8');
  if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
  }
  content = content.replace(
    /<img src="\/marketplace\.webp" onError=\{\(e\) => e\.currentTarget\.src = '\/marketplace\.webp'\} alt="Marketplace" className="w-full h-full object-cover" loading="lazy" \/>/g,
    '<Image src="/marketplace.webp" alt="Marketplace" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />'
  );
  fs.writeFileSync(seller1, content);
}

const seller2 = 'src/components/SellerProductDetailPageClient.tsx';
if (fs.existsSync(seller2)) {
  let content = fs.readFileSync(seller2, 'utf8');
  if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
  }
  content = content.replace(
    /<img src=\{img\} alt=\{`\$\{product\.name\} \$\{idx\}`\} className="w-full h-full object-cover" \/>/g,
    '<Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />'
  );
  content = content.replace(
    /<img src=\{product\.seller\.photoUrl\} alt="Seller" className="w-full h-full object-cover rounded-2xl" \/>/g,
    '<Image src={product.seller.photoUrl || "/contractor.jpeg"} alt="Seller" fill className="object-cover rounded-2xl" sizes="(max-width: 768px) 50vw, 33vw" />'
  );
  fs.writeFileSync(seller2, content);
}

console.log('Optimized Seller pages');
