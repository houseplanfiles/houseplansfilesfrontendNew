const fs = require('fs');

const updateFile = (file, type) => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  if (!code.includes('trackAnalytics')) {
    code = code.replace(
      /import \{ toast \} from "sonner";/,
      'import { toast } from "sonner";\nimport { trackAnalytics } from "@/lib/analytics";'
    );
    // For ProductDetailClient.tsx
    code = code.replace(
      /setProduct\(data\);/,
      `setProduct(data);\n        trackAnalytics('${type}', data._id, 'view');`
    );
    fs.writeFileSync(file, code);
  }
};

updateFile('src/components/ProductDetailClient.tsx', 'product');
updateFile('src/components/SellerProductDetailPageClient.tsx', 'sellerProduct');

console.log('Products updated');
