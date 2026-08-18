import re

file_path = 'src/components/MultiRoleRegisterPageClient.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'const homeDesigningProfessions = \[.*?\];',
    '''const homeDesigningProfessions = [
  "Architects & engineers", "Interior designer", "Contractors Building & Interior", "Electrical Contractor", "Plumbing Contractor", 
  "Tiles & Stone Contractor", "Painting Contractor", "Carpenter Services", "False Ceiling Contractor", "Building material"
];''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'const industrialProfessions = \[.*?\];',
    '''const industrialProfessions = [
  "Pre Engineering Buildings", "Pre Fabricated Buildings", "Pre Cast Concrete Material", "Machinery Services", "Manpower Supply", "Building Inspection Services", "Bulk Building Material Services"
];''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'const otherServicesProfessions = \[.*?\];',
    '''const otherServicesProfessions = [
  "Pest Control Service", "HVAC System Installation", "Lift Installation Services", "Solar Panel Installation", 
  "Home Automation", "Water Proofing Installation", "Garden & Landscaping Contractor", "Modular Kitchen Services", "Swimming Pool Contractor", "Fire safety services", "Fabricator"
];''',
    content,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated file")
