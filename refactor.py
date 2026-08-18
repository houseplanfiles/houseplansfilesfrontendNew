import re

file_path = 'src/components/MultiRoleRegisterPageClient.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update userRoles
content = re.sub(
    r'const userRoles = \[.*?\];',
    '''const userRoles = [
  { id: "user", label: "Register as a Home owner" },
  { id: "professional", label: "Register as a Architect, engineer, interior designer" },
  { id: "seller", label: "Register as a manufacturer, supplier or Shop" },
  { id: "Contractor", label: "Register as a Contractor" },
  { id: "home_designing", label: "Register for Home Designing & Construction Services" },
  { id: "industrial", label: "Register for Industrial Construction & Infrastructure Services" },
  { id: "other_services", label: "Register for Other Services" },
];''',
    content,
    flags=re.DOTALL
)

# 2. Update contractorProfessions and add new lists
content = re.sub(
    r'const contractorProfessions = \[.*?\n\];',
    '''const contractorProfessions = [
  "Civil Construction Contractor", "Interior Contractor", "Electrical Contractor",
  "Plumbing Contractor", "Tiles & Granite Contractor", "Painting & Waterproofing Contractor",
  "Swimming Pool Contractor", "Pre Engineering Board / PEB", "Pre Fabricated House Contractor",
  "Pest Control Contractor", "Landscaping & Garden Contractor", "Manpower Supply",
  "Modular Kitchen Contractor", "Lift Services Contractor", "Building Inspection Contractor",
  "Solar Rooftop Panel Contractor", "HVAC Contractor", "Carpenter", "Glass Fabricator",
  "Labour Contractor", "Turnkey Contractor"
];

const homeDesigningProfessions = [
  "Building", "Interior", "Electrical", "Plumbing", "Tiles & Granite", 
  "Flooring", "Painting & Waterproofing", "Carpenter", "Swimming Pool"
];

const industrialProfessions = [
  "Pre Engineering Board / PEB", "Pre Fabricated House", "Building Inspection", "Manpower Supply"
];

const otherServicesProfessions = [
  "Pest Control", "Landscaping & Garden", "Modular Kitchen", "Lift Services", 
  "Solar Rooftop Panel", "HVAC", "Glass Fabricator"
];''',
    content,
    flags=re.DOTALL
)

# 3. Update handleSubmit
content = re.sub(
    r'if \(key === "serviceTypes" && Array\.isArray\(value\)\) \{\s*dataToSubmit\.append\(key, JSON\.stringify\(value\)\);\s*\} else \{\s*dataToSubmit\.append\(key, value as string \| Blob\);\s*\}',
    '''if (key === "serviceTypes" && Array.isArray(value)) {
          dataToSubmit.append(key, JSON.stringify(value));
        } else if (key === "role" && ["home_designing", "industrial", "other_services"].includes(value as string)) {
          dataToSubmit.append("role", "Contractor");
        } else {
          dataToSubmit.append(key, value as string | Blob);
        }''',
    content
)

# 4. Update the switch case for Contractor
contractor_case = '''      case "Contractor":
      case "home_designing":
      case "industrial":
      case "other_services": {
        let professionsList: string[] = [];
        if (selectedRole === "Contractor") professionsList = contractorProfessions;
        else if (selectedRole === "home_designing") professionsList = homeDesigningProfessions;
        else if (selectedRole === "industrial") professionsList = industrialProfessions;
        else if (selectedRole === "other_services") professionsList = otherServicesProfessions;

        return (
          <motion.div key={selectedRole} {...motionProps} className="space-y-5">
            <div>
              <Label>Full Name*</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Company Name*</Label>
              <Input
                id="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Phone*</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Profession*</Label>
              <Select
                onValueChange={(v) => handleSelectChange(v, "profession")}
                value={formData.profession}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Profession" />
                </SelectTrigger>
                <SelectContent>
                  {professionsList.map((prof) => (
                    <SelectItem key={prof} value={prof}>
                      {prof}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>'''

content = re.sub(
    r'      case "Contractor":\s*return \(\s*<motion\.div key=\{selectedRole\} \{\.\.\.motionProps\} className="space-y-5">\s*<div>\s*<Label>Full Name\*</Label>\s*<Input\s*id="name"\s*required\s*value=\{formData\.name\}\s*onChange=\{handleChange\}\s*/>\s*</div>\s*<div>\s*<Label>Company Name\*</Label>\s*<Input\s*id="companyName"\s*required\s*value=\{formData\.companyName\}\s*onChange=\{handleChange\}\s*/>\s*</div>\s*<div>\s*<Label>Phone\*</Label>\s*<Input\s*id="phone"\s*type="tel"\s*required\s*value=\{formData\.phone\}\s*onChange=\{handleChange\}\s*/>\s*</div>\s*<div>\s*<Label>Profession\*</Label>\s*<Select\s*onValueChange=\{\(v\) => handleSelectChange\(v, "profession"\)\}\s*value=\{formData\.profession\}\s*required\s*>\s*<SelectTrigger>\s*<SelectValue placeholder="Select Profession" />\s*</SelectTrigger>\s*<SelectContent>\s*\{contractorProfessions\.map\(\(group\) => \(\s*<SelectGroup key=\{group\.category\}>\s*<SelectLabel.*?</SelectLabel>\s*\{group\.professions\.map\(\(prof\) => \(\s*<SelectItem key=\{prof\} value=\{prof\}>\s*\{prof\}\s*</SelectItem>\s*\)\)\}\s*</SelectGroup>\s*\)\)\}\s*</SelectContent>\s*</Select>\s*</div>',
    contractor_case,
    content,
    flags=re.DOTALL
)

# And add the closing brace for the Contractor case
content = content.replace(
'''              </div>
            </div>
          </motion.div>
        );

      default:''',
'''              </div>
            </div>
          </motion.div>
        );
      }

      default:'''
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated file")
