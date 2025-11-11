export default async function handler(req,res){
  const token = req.headers.authorization || req.cookies?.token || '';
  try{
    const r = await fetch('https://nexlearn.noviindusdemosites.in/question/list',{headers:{Authorization: token}});
    const data = await r.json();
    return res.status(r.status).json(data);
  }catch(e){
    return res.status(500).json({success:false,message:e.message});
  }
}
