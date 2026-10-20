# Собирает весь сайт в один автономный HTML-файл: python3 tools/single.py <выходной файл>
import re, base64, json, sys, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p): return open(os.path.join(R, p), encoding='utf-8').read()
def b64(p): return base64.b64encode(open(os.path.join(R, p), 'rb').read()).decode()
def inline_fonts(css, folder):
    css = re.sub(r'url\(([^)]+\.woff2)\)', lambda m: 'url(data:font/woff2;base64,' + b64(folder + m.group(1)) + ')', css)
    return re.sub(r',url\([^)]+\.(woff|ttf)\) format\("(woff|truetype)"\)', '', css)
data = {c: json.loads(rd(f'data/{c}.json')) for c in ['f7', 'f8', 'f9', 'h7', 'h8', 'h9']}
icon = 'data:image/png;base64,' + b64('apple-touch-icon.png')
h = rd('index.html')
h = h.replace('href="apple-touch-icon.png"', f'href="{icon}"').replace('href="icon-192.png"', f'href="{icon}"')
h = h.replace('<link rel="manifest" href="manifest.webmanifest">\n', '')
h = h.replace('<link rel="stylesheet" href="fonts/fonts.css">', '<style>' + inline_fonts(rd('fonts/fonts.css'), 'fonts/') + '</style>')
h = h.replace('<link rel="stylesheet" href="katex/katex.min.css">', '<style>' + inline_fonts(rd('katex/katex.min.css'), 'katex/') + '</style>')
h = h.replace('<link rel="stylesheet" href="style.css">', '<style>' + rd('style.css') + '</style>')
dj = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
h = h.replace('<script src="schedule.js"></script>', '<script>\n' + rd('schedule.js') + 'window.ALLDATA = ' + dj + ';\n</script>')
h = h.replace('<script src="app.js"></script>', '<script>\n' + rd('app.js') + '</script>')
assert not re.search(r'(href|src)="(?!data:|#)', h.split('<body>')[1].split('<script>')[0])
open(sys.argv[1], 'w', encoding='utf-8').write(h)
print(round(len(h.encode()) / 1e6, 2), 'MB')
