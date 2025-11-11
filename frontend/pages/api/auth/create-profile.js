export const config = { api: { bodyParser: false } };
import formidable from 'formidable';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({success:false,message:'Method not allowed'});
  try{    
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files)=>{
      if(err) return res.status(400).json({success:false,message:'Invalid form'});
      const fd = new FormData();
      Object.entries(fields).forEach(([k,v])=>fd.append(k, Array.isArray(v)?v[0]:v));
      const f = files['profile_image'];
      if(f){ 
        const blob = await fetch('file://'+f[0].filepath).then(r=>r.blob()).catch(()=>null);
        if(blob) fd.append('profile_image', blob, f[0].originalFilename || 'image.jpg');
      }
      const r = await fetch('https://nexlearn.noviindusdemosites.in/auth/create-profile',{method:'POST', body: fd});
      const data = await r.json();
      return res.status(r.status).json(data);
    });
  }catch(e){
    return res.status(500).json({success:false,message:e.message})
  }
}
