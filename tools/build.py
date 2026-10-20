import re, json, os, sys, subprocess, markdown, datetime
S = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1]
COURSES = [('f7','Физика','7','phys7',2),('f8','Физика','8','phys8',2),('f9','Физика','9','phys9',2),
           ('h7','Химия','7','chem7',1),('h8','Химия','8','chem8',2),('h9','Химия','9','chem9',2)]
# latex blocks
latex = []
def grab(m):
    latex.append(m.group(1).strip()); return f'\n\nKTXPH{len(latex)-1}KTX\n\n'
src = {}
for cid,_,_,fn,_ in COURSES:
    t = open(f'{S}/md/{fn}.md', encoding='utf-8').read()
    src[cid] = re.sub(r'```latex\n(.*?)\n```', grab, t, flags=re.S)
rendered = json.loads(subprocess.run(['node', f'{S}/build/katex.js', f'{S}/k/node_modules/katex'],
    input=json.dumps(latex), capture_output=True, text=True, check=True).stdout)
def md2html(t):
    h = markdown.markdown(t, extensions=['tables','sane_lists'])
    h = re.sub(r'<p>KTXPH(\d+)KTX</p>', lambda m: '<div class="f">'+rendered[int(m.group(1))]+'</div>', h)
    return h
data = {}; index = []
for cid,subj,grade,fn,pw in COURSES:
    t = src[cid]
    parts = re.split(r'^(#{2,3}) (.*)$', t, flags=re.M)
    sections = []; cur = None
    for i in range(1, len(parts), 3):
        lvl, title, body = parts[i], parts[i+1].strip(), parts[i+2]
        m = re.match(r'Урок (\d+)\.\s*(.*)', title)
        if lvl == '###' and m:
            n = int(m.group(1))
            cur['lessons'].append({'n': n, 't': m.group(2), 'h': md2html(body)})
            index.append([cid, n, m.group(2), cur['title']])
        elif lvl == '##' and not title.startswith('Как'):
            cur = {'title': title, 'intro': md2html(body.strip()) if body.strip() else '', 'lessons': []}
            sections.append(cur)
    ns = [l['n'] for s in sections for l in s['lessons']]
    assert ns == list(range(1, len(ns)+1)), (cid, ns)
    data[cid] = {'id':cid,'name':f'{subj} {grade}','subj':subj,'grade':grade,'perWeek':pw,'count':len(ns),'sections':sections}
os.makedirs(f'{OUT}/data', exist_ok=True)
for cid in data:
    json.dump(data[cid], open(f'{OUT}/data/{cid}.json','w',encoding='utf-8'), ensure_ascii=False, separators=(',',':'))
# weeks
weeks = []
for line in open(f'{S}/weeks.txt', encoding='utf-8'):
    m = re.search(r'\((\d\d)\.(\d\d)–(\d\d)\.(\d\d)\.(\d{4})\)', line)
    if not m: continue
    d1,m1,d2,m2,y = m.groups(); y = int(y)
    y1 = y-1 if int(m1) > int(m2) else y
    weeks.append([f'{y1}-{m1}-{d1}', f'{y}-{m2}-{d2}'])
meta = [{k:v for k,v in data[c].items() if k!='sections'} for c in data]
js = ('// Расписание. Можно править: даты учебных недель (начало, конец) и сколько уроков в неделю.\n'
      '// Если неделя попала на каникулы — удалите её строку, уроки сдвинутся сами.\n'
      'window.WEEKS = [\n' + ',\n'.join(f'  ["{a}", "{b}"]' for a,b in weeks) + '\n];\n'
      '// Дни недели, в которые идут уроки (1 = пн ... 6 = сб). Пустой список = не указано.\n'
      'window.DAYS = {' + ', '.join(f'{c}: []' for c in data) + '};\n'
      'window.COURSES = ' + json.dumps(meta, ensure_ascii=False) + ';\n'
      'window.INDEX = ' + json.dumps(index, ensure_ascii=False, separators=(',',':')) + ';\n')
open(f'{OUT}/schedule.js','w',encoding='utf-8').write(js)
print(len(weeks), {c:data[c]['count'] for c in data}, len(latex))
