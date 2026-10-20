const katex=require(process.argv[2]);let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
const a=JSON.parse(s);process.stdout.write(JSON.stringify(a.map(x=>katex.renderToString(x,{displayMode:true,throwOnError:false,output:'html'}))));});
