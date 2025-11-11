export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({success:false,message:'Method not allowed'});
  try{
    const r = await fetch('https://nexlearn.noviindusdemosites.in/auth/send-otp',{method:'POST', headers:{}, body: JSON.stringify(req.body)});
    const data = await r.json();
    return res.status(r.status).json(data);
  }catch(e){
    return res.status(500).json({success:false,message:e.message})
  }
}
