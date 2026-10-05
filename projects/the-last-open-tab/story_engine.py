#!/usr/bin/env python3
"""Continuity-aware original story brief generator; local, offline, no model/API.
Drafts are not canon. A human-reviewed receipt is required before a draft can
be accepted into canon. It never publishes or claims trends are current.
"""
from __future__ import annotations
import argparse,csv,json,re
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
ROOT=Path(__file__).resolve().parent
PLOTS=[
 ('The Door in the Notes','Who finished the story everyone witnessed?'),
 ('The Price of Perfect','What does a $10,000 night actually buy?'),
 ('The Map That Moved','Which route changed, and who saw it happen?'),
 ('The Borrowed Voice','Who made the recording that sounds like the mentor?'),
 ('The Audience of One','Who was the private message inside the public show for?'),
 ('The Quiet Rehearsal','Which ledger tells the fuller story about the theatre?'),
 ('The Final Projector','What choice closes the mentor question this season?'),
]
def read_json(p):return json.loads(p.read_text(encoding='utf-8'))
def write_json(p,obj):p.write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
def trend_candidates(root):
 p=root/'trends.csv'
 if not p.exists():return []
 with p.open(newline='',encoding='utf-8') as f:rows=list(csv.DictReader(f))
 good=[]
 for row in rows:
  required=['keyword','source_url_or_pdf_page','checked_at_pacific','geography','time_window','search_type','top_or_rising']
  if not all((row.get(k) or '').strip() for k in required):continue
  # A source row may still need verification. Never assert live rank from it.
  good.append({k:row[k].strip() for k in required})
 return good
def draft(root):
 canon=read_json(root/'canon.json'); drafts=root/'drafts';drafts.mkdir(exist_ok=True)
 used={int(x['id']) for x in canon.get('episode_history',[]) if str(x.get('id','')).isdigit()}
 used|={int(x['id']) for x in canon.get('proposed_draft_episodes',[]) if str(x.get('id','')).isdigit()}
 used|={int(x.name.split('-')[1]) for x in drafts.iterdir() if re.fullmatch(r'episode-\d{3}',x.name)}
 number=next(i for i in range(1,len(PLOTS)+1) if i not in used) if len(used)<len(PLOTS) else None
 if number is None:raise SystemExit('Season-one beat bank exhausted. Review an ending and create a new season spine before more drafts.')
 title,question=PLOTS[number-1];episode_id=f'{number:03d}';out=drafts/f'episode-{episode_id}';out.mkdir(exist_ok=False)
 trends=trend_candidates(root);trend=trends[(number-1)%len(trends)] if trends else None
 payload={'id':episode_id,'title':title,'status':'draft','created_pacific':datetime.now(ZoneInfo('America/Los_Angeles')).strftime('%Y-%m-%d %H:%M %Z'),'local_question':question,'character_choice':'TO BE WRITTEN','local_resolution':'TO BE WRITTEN','persistent_change':'TO BE WRITTEN','rights_reviewed':False,'facts_reviewed':False,'trend_candidate':trend,'trend_warning':'Candidate source row only; verify original export before any ranking claim.' if trend else 'No sourced trend row; story proceeds from character/canon.','canon_revision_read':canon['revision']}
 write_json(out/'episode.json',payload)
 prompt=f'''# Story-room prompt — Episode {episode_id}: {title}\n\nCurrent local question: {question}\n\nCast: Mara wants her missing mentor, Ivo must keep the theatre open, June protects a usable public record. Preserve all five canon rules in canon.json and earlier accepted changes. The Presenter can make claims but does not make them true.\n\nTrend candidate: {trend['keyword'] if trend else 'NONE VERIFIED'}. If no verified source or poor character fit, omit a trend term.\n\nWrite an original 6–8 minute stage manuscript with playable actions, one complete local answer, a meaningful choice and cost, and a lasting change. Use gothic-comic stagecraft and do not copy Alice, Lollipop Chainsaw or other referenced works. Then derive a complete 45–60 second vertical cut, an optional up-to-180-second cut when account limits allow, a separately composed landscape video plan, captions and a portable blog. Record unknown facts as unknown. Return a canon receipt with evidence and what remains open. Do not promote a draft, publish or claim sales.\n'''
 (out/'PROMPT.md').write_text(prompt,encoding='utf-8')
 print(out)
def accept(root,episode_id):
 if not re.fullmatch(r'\d{3}',episode_id):raise SystemExit('Episode ID must be three digits')
 p=root/'drafts'/f'episode-{episode_id}'/'episode.json'
 if not p.exists():raise SystemExit(f'Missing draft {p}')
 ep=read_json(p);canon=read_json(root/'canon.json')
 if ep['status']!='reviewed':raise SystemExit('Draft must have status reviewed')
 if ep['canon_revision_read']!=canon['revision']:raise SystemExit('Canon changed since drafting; reconcile first')
 if not ep['rights_reviewed'] or not ep['facts_reviewed']:raise SystemExit('Rights and factual wording review required')
 for key in ['character_choice','local_resolution','persistent_change']:
  if not str(ep.get(key,'')).strip() or 'TO BE WRITTEN' in ep[key]:raise SystemExit(f'Incomplete {key}')
 if any(x['id']==episode_id for x in canon['episode_history']):raise SystemExit('Already accepted')
 canon['episode_history'].append({k:ep[k] for k in ['id','title','character_choice','local_resolution','persistent_change']});canon['revision']+=1
 write_json(root/'canon.json',canon);ep['status']='accepted_into_canon';write_json(p,ep);print(f'Accepted {episode_id}; canon revision {canon["revision"]}')
def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--root',type=Path,default=ROOT)
 sub=parser.add_subparsers(dest='command',required=True);sub.add_parser('draft');a=sub.add_parser('accept');a.add_argument('episode_id')
 args=parser.parse_args();root=args.root.resolve()
 if args.command=='draft':draft(root)
 else:accept(root,args.episode_id)
if __name__=='__main__':main()
