const fs = require('fs');

const file = 'src/components/professional/DashboardPage.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('stats.profileViews')) {
  // Update stats object
  code = code.replace(
    /enquiriesCount: inquiries\?\.length \|\| 0,/,
    `enquiriesCount: inquiries?.length || 0,\n         profileViews: userInfo?.profileViews || 0,\n         contactClicks: userInfo?.contactClicks || 0,`
  );

  // Update summaryCards
  code = code.replace(
    /\{ title: "Active Projects", value: stats\.projectsCount, icon: LayoutGrid \},/,
    `{ title: "Active Projects", value: stats.projectsCount, icon: LayoutGrid },\n    { title: "Profile Views", value: stats.profileViews, icon: Eye },\n    { title: "Contact Clicks", value: stats.contactClicks, icon: PlusCircle },`
  );

  fs.writeFileSync(file, code);
}

const file2 = '../backend/controllers/userController.js';
if (fs.existsSync(file2)) {
  let code2 = fs.readFileSync(file2, 'utf8');
  if (!code2.includes('profileViews: user.profileViews')) {
    code2 = code2.replace(
      /token: generateToken\(user\._id\),/g,
      `profileViews: user.profileViews,\n      contactClicks: user.contactClicks,\n      token: generateToken(user._id),`
    );
    fs.writeFileSync(file2, code2);
  }
}

console.log('Dashboard updated');
