const fs = require('fs');

const file = 'src/components/admin/AdminDashboardPage.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('totalProfileViews')) {
  // Add state for analytics
  code = code.replace(
    /const \{ userInfo \} = useSelector\(\(state: RootState\) => state\.user\);/,
    `const { userInfo } = useSelector((state: RootState) => state.user);\n  const [analytics, setAnalytics] = React.useState<any>(null);`
  );

  // Add fetch for analytics inside useEffect
  code = code.replace(
    /dispatch\(fetchDashboardSummary\(\)\);/,
    `dispatch(fetchDashboardSummary());\n    const fetchAnalytics = async () => {\n      try {\n        const { data } = await axios.get(\`\${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics/admin\`, {\n          headers: { Authorization: \`Bearer \${userInfo?.token}\` }\n        });\n        setAnalytics(data);\n      } catch (err) {}\n    };\n    if (userInfo?.token) fetchAnalytics();`
  );

  // Add axios import
  code = code.replace(
    /import \{ useDispatch, useSelector \} from "react-redux";/,
    `import { useDispatch, useSelector } from "react-redux";\nimport axios from "axios";`
  );

  // Add analytics cards to row2Cards or create row3Cards
  const row3CardsCode = `
  const row3Cards = [
    {
      title: "PROFILE VIEWS",
      value: (analytics?.profileViews || 0).toLocaleString(),
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "CONTACT CLICKS",
      value: (analytics?.contactClicks || 0).toLocaleString(),
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "PRODUCT VIEWS",
      value: (analytics?.productViews || 0).toLocaleString(),
      icon: ShoppingCart,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "PLAN VIEWS",
      value: (analytics?.planViews || 0).toLocaleString(),
      icon: BookOpen,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
  ];
`;

  code = code.replace(
    /return \(/,
    `${row3CardsCode}\n  return (`
  );

  // Render row3Cards in JSX
  const renderRow3 = `
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {row3Cards.map((card, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              </div>
              <div className={\`w-12 h-12 rounded-full flex items-center justify-center \${card.iconBg}\`}>
                <card.icon className={\`w-6 h-6 \${card.iconColor}\`} />
              </div>
            </div>
          ))}
        </div>
`;

  code = code.replace(
    /\{row2Cards\.map/,
    `</div>\n${renderRow3}\n        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">\n          {row2Cards.map`
  );

  fs.writeFileSync(file, code);
}

console.log('Admin Dashboard updated');
