#!/usr/bin/env python3
"""Make a readable, original two-play PDF from the local manuscript drafts."""
from pathlib import Path
from xml.sax.saxutils import escape
import re
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER,TA_LEFT
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
R=Path(__file__).resolve().parent
OUT=R/'SCRIPTBOOK-DRAFT.pdf'
normal=ParagraphStyle('body',fontName='Helvetica',fontSize=10.8,leading=16,spaceAfter=7,textColor=HexColor('#171923'))
head=ParagraphStyle('head',parent=normal,fontName='Helvetica-Bold',fontSize=20,leading=26,spaceBefore=20,spaceAfter=12)
sub=ParagraphStyle('sub',parent=normal,fontName='Helvetica-Bold',fontSize=13,leading=18,spaceBefore=14)
cast=ParagraphStyle('cast',parent=normal,fontName='Helvetica-Bold',spaceBefore=9)
stage=ParagraphStyle('stage',parent=normal,fontName='Helvetica-Oblique',textColor=HexColor('#5b4d67'))
title=ParagraphStyle('title',parent=normal,fontName='Helvetica-Bold',fontSize=26,leading=34,alignment=TA_CENTER,textColor=HexColor('#f4eef8'))
lead=ParagraphStyle('lead',parent=normal,fontSize=13,leading=19,alignment=TA_CENTER,textColor=HexColor('#d7bde4'))
cover_note=ParagraphStyle('covernote',parent=normal,textColor=HexColor('#e1d9e9'),leftIndent=72,rightIndent=72,alignment=TA_CENTER,leading=15)
flow=[Spacer(1,130),Paragraph('THE LAST OPEN TAB',title),Spacer(1,20),Paragraph('Two original gothic-comedy plays',lead),Spacer(1,10),Paragraph('The Door in the Notes  ·  The Price of Perfect',lead),Spacer(1,32),Paragraph('Draft scriptbook  •  October 4, 2026',lead),Spacer(1,50),Paragraph('Fictional theatre sales appear inside Episode 002. This work does not report real ticket revenue or promise a perfect life.',cover_note),PageBreak()]
flow +=[Paragraph('Contents',head),Paragraph('Series premise and canon',normal),Paragraph('Episode 001 — The Door in the Notes',normal),Paragraph('Episode 002 — The Price of Perfect',normal),PageBreak()]
files=[('SERIES-BIBLE.md','SERIES PREMISE'),('EPISODE-001-MANUSCRIPT.md','EPISODE 001'),('EPISODE-002-MANUSCRIPT.md','EPISODE 002')]
for fi,(name,label) in enumerate(files):
 flow.append(Paragraph(label,head))
 for line in (R/name).read_text().splitlines():
  v=line.strip()
  if not v or v=='---':continue
  v=re.sub(r'\*\*(.*?)\*\*',r'\1',v)
  v=re.sub(r'\*(.*?)\*',r'\1',v)
  v=re.sub(r'`([^`]*)`',r'\1',v)
  if v.startswith('### '):flow.append(Paragraph(escape(v[4:]),sub))
  elif v.startswith('## '):flow.append(Paragraph(escape(v[3:]),head))
  elif v.startswith('# '):flow.append(Paragraph(escape(v[2:]),head))
  elif v.startswith('- '):flow.append(Paragraph('• '+escape(v[2:]),normal))
  elif line.strip().startswith('*[') or line.strip().startswith('['):flow.append(Paragraph(escape(v),stage))
  elif re.match(r'^[A-Z][A-Z ]{1,20}:',v):flow.append(Paragraph(escape(v),cast))
  else:flow.append(Paragraph(escape(v),normal))
 if fi<len(files)-1:flow.append(PageBreak())
def footer(canvas,doc):
 if doc.page==1:
  canvas.setFillColor(HexColor('#0d0915'));canvas.rect(0,0,612,792,stroke=0,fill=1)
  canvas.setStrokeColor(HexColor('#baff35'));canvas.setLineWidth(5);canvas.line(48,680,564,680)
  canvas.setStrokeColor(HexColor('#8c4aa6'));canvas.setLineWidth(2)
  for inset in range(6):
   path=canvas.beginPath();path.moveTo(75+inset*14,100);path.lineTo(75+inset*14,590);path.curveTo(80+inset*14,735,532-inset*14,735,537-inset*14,590);path.lineTo(537-inset*14,100);canvas.drawPath(path,stroke=1)
  canvas.setFillColor(HexColor('#d4a84e'));canvas.rect(48,70,516,3,stroke=0,fill=1)
 canvas.setStrokeColor(HexColor('#b8d531'));canvas.line(48,43,564,43)
 canvas.setFont('Helvetica',8);canvas.setFillColor(HexColor('#d7bde4') if doc.page==1 else HexColor('#5b4d67'));canvas.drawString(48,31,'THE LAST OPEN TAB  •  ORIGINAL FICTION  •  DRAFT');canvas.drawRightString(564,31,str(doc.page))
SimpleDocTemplate(str(OUT),pagesize=letter,rightMargin=48,leftMargin=48,topMargin=48,bottomMargin=58,title='The Last Open Tab — Draft Scriptbook',author='SmartPickShop Holdings creative studio').build(flow,onFirstPage=footer,onLaterPages=footer)
print(OUT)
