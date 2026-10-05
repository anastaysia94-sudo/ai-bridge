#!/usr/bin/env python3
"""Create an original, captioned gothic-neon animatic with local FFmpeg flite narration."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess,json,math,textwrap
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'animatic-002';OUT.mkdir(exist_ok=True)
SCENES=[
 ('$10,000 TODAY','The screen promised ten thousand dollars by midnight would make Mara perfect forever.','A beautiful promise. A terrible price.'),
 ('THE EASY SALE','One buyer offered ten thousand dollars. In exchange, they would own every ending the theatre ever made.','Read the terms.'),
 ('AUTHORIZED ≠ PAID','June found the catch. The payment was only authorized. No money had arrived.','Check the receipt.'),
 ('NINETY-NINE','The theatre sold honest tickets to its real show. Ninety nine seats were taken. One remained.','One seat left.'),
 ('ONE REAL BUYER','A stranger came for a play, not a miracle. She bought the final seat.','What does the ticket buy?'),
 ('10,000 GROSS','One hundred paid tickets at one hundred dollars made ten thousand dollars in story sales. Costs and refunds still matter.','100 × $100 = $10,000'),
 ('NOT PERFECT','The Presenter painted a halo on Mara. She stepped aside. The money was real. The promise was not proven.','A number cannot prove forever.'),
 ('I AM HERE','The projector went dark. Someone coughed. The house bell rang. Mara said, I am here.','THE LAST OPEN TAB • EPISODE 002')]
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def run(args):subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
def duration(p):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(p)],text=True))
def ts(v):
 h=int(v//3600);m=int(v//60)%60;s=int(v%60);ms=int(round((v-int(v))*1000));return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
def draw_scene(i,title,subtitle):
 w,h=1080,1920;im=Image.new('RGB',(w,h),'#0d0915');d=ImageDraw.Draw(im)
 # Original velvet arches and projector beam; no borrowed franchise imagery.
 for n in range(22):
  x=35+n*47;d.line((x,0,x+110,h),fill=(17+n//3,9,25+n//2),width=10)
 for a in range(12):
  rect=(75+a*13,185+a*13,w-75-a*13,1320-a*13)
  d.arc(rect,180,360,fill=(75+a*5,38+a*2,91+a*3),width=3)
 d.polygon([(540,80),(95,1540),(985,1540)],fill='#23132e')
 d.line((85,1530,995,1530),fill='#d8a54e',width=11)
 d.rectangle((80,140,1000,154),fill='#ccff35')
 d.text((80,195),'THE LAST OPEN TAB  •  ACT II',font=ImageFont.truetype(REG,33),fill='#d3a8db')
 lines=textwrap.wrap(title,width=16);y=490
 for line in lines:d.text((80,y),line,font=ImageFont.truetype(FONT,84),fill='#f8f2ef',stroke_width=2,stroke_fill='#360e42');y+=110
 d.rectangle((80,985,1000,1280),fill='#1e1529',outline='#ccff35',width=4)
 sy=1030
 for line in textwrap.wrap(subtitle,width=28):d.text((115,sy),line,font=ImageFont.truetype(REG,41),fill='#f6f0ed');sy+=58
 d.text((80,1630),f'{i+1:02d} / {len(SCENES):02d}',font=ImageFont.truetype(FONT,33),fill='#ccff35')
 d.text((80,1700),'ORIGINAL FICTION • ANIMATIC',font=ImageFont.truetype(REG,29),fill='#d3a8db')
 return im
segments=[];srt=[];elapsed=0.0
for i,(title,narration,subtitle) in enumerate(SCENES):
 image=OUT/f'card-{i+1:02d}.png';draw_scene(i,title,subtitle).save(image)
 speech=OUT/f'voice-{i+1:02d}.txt';speech.write_text(narration)
 wav=OUT/f'voice-{i+1:02d}.wav'
 run(['ffmpeg','-v','error','-y','-f','lavfi','-i',f'flite=textfile={speech}:voice=slt','-ar','48000',str(wav)])
 vd=duration(wav);segment_duration=max(5.2,vd+1.2)
 mp4=OUT/f'segment-{i+1:02d}.mp4'
 run(['ffmpeg','-v','error','-y','-loop','1','-i',str(image),'-i',str(wav),'-vf','fps=30,format=yuv420p','-t',f'{segment_duration:.3f}','-c:v','libx264','-preset','ultrafast','-crf','21','-c:a','aac','-b:a','128k','-af',f'apad=pad_dur={max(0,segment_duration-vd):.3f}','-movflags','+faststart',str(mp4)])
 segments.append(mp4);srt.append(f'{i+1}\n{ts(elapsed)} --> {ts(elapsed+vd)}\n{narration}\n');elapsed+=duration(mp4)
listfile=OUT/'segments.txt';listfile.write_text('\n'.join("file '"+p.name+"'" for p in segments))
final=OUT/'price-of-perfect-animatic-1080x1920.mp4'
run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(listfile),'-c','copy','-movflags','+faststart',str(final)])
(OUT/'captions.srt').write_text('\n'.join(srt))
(OUT/'README.md').write_text('# Episode 002 narrated animatic\n\nOriginal slide art and local synthetic narration. This is a proof of concept, not the final actor film. Real theatre sales are unverified; the $10,000 claim is a fictional plot event. `captions.srt` and individual `card-*.png` files support review. No paid model, stock asset, music or external API used.\n')
print(json.dumps({'video':str(final),'seconds':duration(final),'bytes':final.stat().st_size,'scenes':len(SCENES),'audio':'local synthetic narration','status':'animatic proof, unpublished'}))
