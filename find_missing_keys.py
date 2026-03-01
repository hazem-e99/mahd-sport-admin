import re, glob

with open(r'D:\Work\Beetleware\MAHD\mahd-sport-Admin\public\locales\en.json', encoding='utf-8') as f:
    content = f.read()
en_keys = set(re.findall(r'^\s+"([^"]+)"\s*:', content, re.MULTILINE))

with open(r'D:\Work\Beetleware\MAHD\mahd-sport-Admin\public\locales\ar.json', encoding='utf-8') as f:
    ar_content = f.read()
ar_keys = set(re.findall(r'^\s+"([^"]+)"\s*:', ar_content, re.MULTILINE))

used = set()
for path in glob.glob(r'D:\Work\Beetleware\MAHD\mahd-sport-Admin\src\**\*.*', recursive=True):
    if path.endswith(('.tsx', '.ts')):
        try:
            t = open(path, encoding='utf-8').read()
            used.update(re.findall(r'getValue\(["\'](.*?)["\']', t))
        except:
            pass

missing_en = sorted(used - en_keys)
missing_ar = sorted(used - ar_keys)

print("=== MISSING from en.json ===")
for k in missing_en:
    print(k)
print(f"\nTOTAL MISSING EN: {len(missing_en)}")

print("\n=== MISSING from ar.json ===")
for k in missing_ar:
    print(k)
print(f"\nTOTAL MISSING AR: {len(missing_ar)}")
