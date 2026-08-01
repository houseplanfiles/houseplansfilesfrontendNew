const fs = require('fs');

const files = [
  'src/components/CityPartnersPageClient.tsx',
  'src/components/HomeDesigningClient.tsx',
  'src/components/IndustrialServicesClient.tsx',
  'src/components/OtherServicesClient.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (!content.includes('import Image from "next/image"')) {
      content = 'import Image from "next/image";\n' + content;
    }

    content = content.replace(
      /<img src="https:\/\/images\.unsplash\.com\/photo-1541888946425-d81bb19240f5\?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-20" alt="Hero" \/>/g,
      '<Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80" className="object-cover opacity-20" alt="Hero" fill priority sizes="100vw" />'
    );

    content = content.replace(
      /<img src=\{contractor\.shopImageUrl \? getFileUrl\(contractor\.shopImageUrl\) : "\/contractor\.jpeg"\} className="w-full h-full object-cover" alt="" \/>/g,
      '<Image src={contractor.shopImageUrl ? getFileUrl(contractor.shopImageUrl) : "/contractor.jpeg"} className="object-cover" alt="Shop Image" fill sizes="(max-width: 768px) 50vw, 25vw" />'
    );
    
    fs.writeFileSync(file, content);
  }
});

console.log('Optimized CityPartners and related files');
