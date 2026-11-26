"""Optional real-model smoke test, only synthetic text (no customer documents)."""
import io
from PIL import Image, ImageDraw, ImageFont
from server import recognize
img=Image.new('RGB',(950,220),'white')
try: font=ImageFont.truetype('arial.ttf',44)
except OSError: font=ImageFont.load_default(size=44)
ImageDraw.Draw(img).text((30,65),'District: Hyderabad',font=font,fill='black')
buf=io.BytesIO();img.save(buf,format='PNG')
result=recognize(buf.getvalue(),'image/png','eng')
print('Engine:',result['engine'],'Synthetic text:',result['text'])
if 'hyderabad' not in result['text'].casefold():raise SystemExit('Synthetic recognition not confirmed; check model/runtime before proceeding.')
print('Synthetic English smoke test passed. Verify Hindi/Telugu and real documents separately.')
