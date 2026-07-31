const fs = require('fs');

const file = 'src/components/professional/DashboardPage.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('totalProductViews')) {
  code = code.replace(
    /let totalSales = 0;\n    let totalRating = 0;\n    let reviewCount = 0;/,
    `let totalSales = 0;\n    let totalRating = 0;\n    let reviewCount = 0;\n    let totalProductViews = 0;`
  );

  code = code.replace(
    /if \(product\.rating && product\.rating > 0\) \{/,
    `totalProductViews += (product.views || 0);\n      if (product.rating && product.rating > 0) {`
  );

  code = code.replace(
    /productsListed: myProducts\?\.length \|\| 0,/,
    `productsListed: myProducts?.length || 0,\n      totalProductViews,\n      profileViews: userInfo?.profileViews || 0,\n      contactClicks: userInfo?.contactClicks || 0,`
  );

  code = code.replace(
    /\{ title: "Average Rating", value: stats\.averageRating, icon: Star \},/,
    `{ title: "Average Rating", value: stats.averageRating, icon: Star },\n    { title: "Product Views", value: stats.totalProductViews, icon: Eye },\n    { title: "Profile Views", value: stats.profileViews, icon: Eye },\n    { title: "Contact Clicks", value: stats.contactClicks, icon: PlusCircle },`
  );

  fs.writeFileSync(file, code);
}

console.log('Seller stats updated');
