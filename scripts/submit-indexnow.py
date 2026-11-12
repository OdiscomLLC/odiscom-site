"""Notify participating search engines about public marketing URLs after deployment."""
import argparse
import json
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--site', required=True, choices=['https://www.odiscom.com', 'https://www.odiscomconstruction.com'])
parser.add_argument('--key-file', type=Path, required=True)
parser.add_argument('--dry-run', action='store_true')
args = parser.parse_args()
key = args.key_file.read_text().strip()
if not 8 <= len(key) <= 128 or not key.isalnum():
    raise SystemExit('Invalid IndexNow verification key')
key_url = args.site + '/' + key + '.txt'
if not args.dry_run:
    published = urllib.request.urlopen(key_url, timeout=30).read().decode().strip()
    if published != key:
        raise SystemExit('Published verification file does not match')
sitemap = urllib.request.urlopen(args.site + '/sitemap.xml', timeout=30).read()
urls = [element.text for element in ET.fromstring(sitemap).iter() if element.tag.endswith('}loc')]
if not urls or len(urls) > 10000 or any(url != args.site and not url.startswith(args.site + '/') for url in urls):
    raise SystemExit('Sitemap contains unexpected URLs')
payload = {'host': urllib.parse.urlparse(args.site).hostname, 'key': key, 'keyLocation': key_url, 'urlList': urls}
if args.dry_run:
    print(f'Would submit {len(urls)} public URLs for {args.site}')
else:
    request = urllib.request.Request('https://api.indexnow.org/indexnow', data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json; charset=utf-8'}, method='POST')
    with urllib.request.urlopen(request, timeout=45) as response:
        print(json.dumps({'site': args.site, 'submitted_urls': len(urls), 'status': response.status, 'meaning': 'Received; indexing and placement are not guaranteed'}))
