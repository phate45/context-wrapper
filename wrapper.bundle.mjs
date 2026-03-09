import{join as I,dirname as D}from"node:path";import{tmpdir as rt}from"node:os";import{fileURLToPath as st}from"node:url";import{Server as ot}from"@modelcontextprotocol/sdk/server/index.js";import{StdioServerTransport as it}from"@modelcontextprotocol/sdk/server/stdio.js";import{Client as at}from"@modelcontextprotocol/sdk/client/index.js";import{StdioClientTransport as ct}from"@modelcontextprotocol/sdk/client/stdio.js";import{ListToolsRequestSchema as lt,CallToolRequestSchema as ut}from"@modelcontextprotocol/sdk/types.js";import{readFileSync as C,readdirSync as J,statSync as X}from"node:fs";import{execSync as V}from"node:child_process";import{join as N,dirname as Y,basename as q,resolve as T,relative as G}from"node:path";import{createRequire as $}from"node:module";var E=null;function w(){return E||(E=$(import.meta.url)("better-sqlite3")),E}function R(o){o.pragma("journal_mode = WAL"),o.pragma("synchronous = NORMAL")}import{readFileSync as M,readdirSync as bt,unlinkSync as P}from"node:fs";import{tmpdir as j}from"node:os";import{join as U}from"node:path";var x=new Set(["the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","has","his","how","its","may","new","now","old","see","way","who","did","get","got","let","say","she","too","use","will","with","this","that","from","they","been","have","many","some","them","than","each","make","like","just","over","such","take","into","year","your","good","could","would","about","which","their","there","other","after","should","through","also","more","most","only","very","when","what","then","these","those","being","does","done","both","same","still","while","where","here","were","much","update","updates","updated","deps","dev","tests","test","add","added","fix","fixed","run","running","using"]);function z(o,t="AND"){let e=o.replace(/['"(){}[\]*:^~]/g," ").split(/\s+/).filter(n=>n.length>0&&!["AND","OR","NOT","NEAR"].includes(n.toUpperCase()));return e.length===0?'""':e.map(n=>`"${n}"`).join(t==="OR"?" OR ":" ")}function W(o,t="AND"){let e=o.replace(/["'(){}[\]*:^~]/g,"").trim();if(e.length<3)return"";let n=e.split(/\s+/).filter(r=>r.length>=3);return n.length===0?"":n.map(r=>`"${r}"`).join(t==="OR"?" OR ":" ")}function B(o,t){if(o.length===0)return t.length;if(t.length===0)return o.length;let e=Array.from({length:t.length+1},(n,r)=>r);for(let n=1;n<=o.length;n++){let r=[n];for(let s=1;s<=t.length;s++)r[s]=o[n-1]===t[s-1]?e[s-1]:1+Math.min(e[s],r[s-1],e[s-1]);e=r}return e[t.length]}function H(o){return o<=4?1:o<=12?2:3}var _=4096;var y=class{#t;#n;#r;#s;#o;#i;#a;#c;#l;#u;#h;#p;#d;#m;#g;#f;#b;#y;#S;#E;constructor(t){let e=w();this.#n=t??U(j(),`context-mode-${process.pid}.db`),this.#t=new e(this.#n,{timeout:5e3}),R(this.#t),this.#T(),this.#w()}cleanup(){try{this.#t.close()}catch{}for(let t of["","-wal","-shm"])try{P(this.#n+t)}catch{}}#T(){this.#t.exec(`
      CREATE TABLE IF NOT EXISTS sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        chunk_count INTEGER NOT NULL DEFAULT 0,
        code_chunk_count INTEGER NOT NULL DEFAULT 0,
        indexed_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE VIRTUAL TABLE IF NOT EXISTS chunks USING fts5(
        title,
        content,
        source_id UNINDEXED,
        content_type UNINDEXED,
        tokenize='porter unicode61'
      );

      CREATE VIRTUAL TABLE IF NOT EXISTS chunks_trigram USING fts5(
        title,
        content,
        source_id UNINDEXED,
        content_type UNINDEXED,
        tokenize='trigram'
      );

      CREATE TABLE IF NOT EXISTS vocabulary (
        word TEXT PRIMARY KEY
      );
    `)}#w(){this.#r=this.#t.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count) VALUES (?, 0, 0)"),this.#s=this.#t.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count) VALUES (?, ?, ?)"),this.#o=this.#t.prepare("INSERT INTO chunks (title, content, source_id, content_type) VALUES (?, ?, ?, ?)"),this.#i=this.#t.prepare("INSERT INTO chunks_trigram (title, content, source_id, content_type) VALUES (?, ?, ?, ?)"),this.#a=this.#t.prepare("INSERT OR IGNORE INTO vocabulary (word) VALUES (?)"),this.#c=this.#t.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#l=this.#t.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#u=this.#t.prepare("DELETE FROM sources WHERE label = ?"),this.#h=this.#t.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        sources.label,
        bm25(chunks, 2.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ?
      ORDER BY rank
      LIMIT ?
    `),this.#p=this.#t.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        sources.label,
        bm25(chunks, 2.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label LIKE ?
      ORDER BY rank
      LIMIT ?
    `),this.#d=this.#t.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        sources.label,
        bm25(chunks_trigram, 2.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ?
      ORDER BY rank
      LIMIT ?
    `),this.#m=this.#t.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        sources.label,
        bm25(chunks_trigram, 2.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label LIKE ?
      ORDER BY rank
      LIMIT ?
    `),this.#g=this.#t.prepare("SELECT word FROM vocabulary WHERE length(word) BETWEEN ? AND ?"),this.#f=this.#t.prepare("SELECT label, chunk_count as chunkCount FROM sources ORDER BY id DESC"),this.#b=this.#t.prepare(`SELECT c.title, c.content, c.content_type, s.label
       FROM chunks c
       JOIN sources s ON s.id = c.source_id
       WHERE c.source_id = ?
       ORDER BY c.rowid`),this.#y=this.#t.prepare("SELECT chunk_count FROM sources WHERE id = ?"),this.#S=this.#t.prepare("SELECT content FROM chunks WHERE source_id = ?"),this.#E=this.#t.prepare(`
      SELECT
        (SELECT COUNT(*) FROM sources) AS sources,
        (SELECT COUNT(*) FROM chunks) AS chunks,
        (SELECT COUNT(*) FROM chunks WHERE content_type = 'code') AS codeChunks
    `)}index(t){let{content:e,path:n,source:r}=t;if(!e&&!n)throw new Error("Either content or path must be provided");let s=e??M(n,"utf-8"),c=r??n??"untitled",i=this.#x(s);return this.#e(i,c,s)}indexPlainText(t,e,n=20){if(!t||t.trim().length===0)return this.#e([],e,"");let r=this.#_(t,n);return this.#e(r.map(s=>({...s,hasCode:!1})),e,t)}indexJSON(t,e,n=_){if(!t||t.trim().length===0)return this.indexPlainText("",e);let r;try{r=JSON.parse(t)}catch{return this.indexPlainText(t,e)}let s=[];return this.#k(r,[],s,n),s.length===0?this.indexPlainText(t,e):this.#e(s,e,t)}#e(t,e,n){let r=t.filter(i=>i.hasCode).length,c=this.#t.transaction(()=>{if(this.#c.run(e),this.#l.run(e),this.#u.run(e),t.length===0){let a=this.#r.run(e);return Number(a.lastInsertRowid)}let i=this.#s.run(e,t.length,r),u=Number(i.lastInsertRowid);for(let a of t){let l=a.hasCode?"code":"prose";this.#o.run(a.title,a.content,u,l),this.#i.run(a.title,a.content,u,l)}return u})();return n&&this.#R(n),{sourceId:c,label:e,totalChunks:t.length,codeChunks:r}}search(t,e=3,n,r="AND"){let s=z(t,r),c=n?this.#p:this.#h,i=n?[s,`%${n}%`,e]:[s,e];return c.all(...i).map(a=>({title:a.title,content:a.content,source:a.label,rank:a.rank,contentType:a.content_type,highlighted:a.highlighted}))}searchTrigram(t,e=3,n,r="AND"){let s=W(t,r);if(!s)return[];let c=n?this.#m:this.#d,i=n?[s,`%${n}%`,e]:[s,e];return c.all(...i).map(a=>({title:a.title,content:a.content,source:a.label,rank:a.rank,contentType:a.content_type,highlighted:a.highlighted}))}fuzzyCorrect(t){let e=t.toLowerCase().trim();if(e.length<3)return null;let n=H(e.length),r=this.#g.all(e.length-n,e.length+n),s=null,c=n+1;for(let{word:i}of r){if(i===e)return null;let u=B(e,i);u<c&&(c=u,s=i)}return c<=n?s:null}searchWithFallback(t,e=3,n){let r=this.search(t,e,n,"AND");if(r.length>0)return r.map(h=>({...h,matchLayer:"porter"}));let s=this.search(t,e,n,"OR");if(s.length>0)return s.map(h=>({...h,matchLayer:"porter"}));let c=this.searchTrigram(t,e,n,"AND");if(c.length>0)return c.map(h=>({...h,matchLayer:"trigram"}));let i=this.searchTrigram(t,e,n,"OR");if(i.length>0)return i.map(h=>({...h,matchLayer:"trigram"}));let u=t.toLowerCase().trim().split(/\s+/).filter(h=>h.length>=3),a=u.join(" "),m=u.map(h=>this.fuzzyCorrect(h)??h).join(" ");if(m!==a){let h=this.search(m,e,n,"AND");if(h.length>0)return h.map(g=>({...g,matchLayer:"fuzzy"}));let p=this.search(m,e,n,"OR");if(p.length>0)return p.map(g=>({...g,matchLayer:"fuzzy"}));let d=this.searchTrigram(m,e,n,"AND");if(d.length>0)return d.map(g=>({...g,matchLayer:"fuzzy"}));let f=this.searchTrigram(m,e,n,"OR");if(f.length>0)return f.map(g=>({...g,matchLayer:"fuzzy"}))}return[]}listSources(){return this.#f.all()}getChunksBySource(t){return this.#b.all(t).map(n=>({title:n.title,content:n.content,source:n.label,rank:0,contentType:n.content_type}))}getDistinctiveTerms(t,e=40){let n=this.#y.get(t);if(!n||n.chunk_count<3)return[];let r=n.chunk_count,s=2,c=Math.max(3,Math.ceil(r*.4)),i=new Map;for(let l of this.#S.iterate(t)){let m=new Set(l.content.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(h=>h.length>=3&&!x.has(h)));for(let h of m)i.set(h,(i.get(h)??0)+1)}return Array.from(i.entries()).filter(([,l])=>l>=s&&l<=c).map(([l,m])=>{let h=Math.log(r/m),p=Math.min(l.length/20,.5),d=/[_]/.test(l),f=l.length>=12,g=d?1.5:f?.8:0;return{word:l,score:h+p+g}}).sort((l,m)=>m.score-l.score).slice(0,e).map(l=>l.word)}getStats(){let t=this.#E.get();return{sources:t?.sources??0,chunks:t?.chunks??0,codeChunks:t?.codeChunks??0}}close(){this.#t.close()}#R(t){let e=t.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(r=>r.length>=3&&!x.has(r)),n=[...new Set(e)];this.#t.transaction(()=>{for(let r of n)this.#a.run(r)})()}#x(t,e=_){let n=[],r=t.split(`
`),s=[],c=[],i="",u=()=>{let l=c.join(`
`).trim();if(l.length===0)return;let m=this.#A(s,i),h=c.some(b=>/^`{3,}/.test(b));if(Buffer.byteLength(l)<=e){n.push({title:m,content:l,hasCode:h}),c=[];return}let p=l.split(/\n\n+/),d=[],f=1,g=()=>{if(d.length===0)return;let b=d.join(`

`).trim();if(b.length===0)return;let S=p.length>1?`${m} (${f})`:m;f++,n.push({title:S,content:b,hasCode:b.includes("```")}),d=[]};for(let b of p){d.push(b);let S=d.join(`

`);Buffer.byteLength(S)>e&&d.length>1&&(d.pop(),g(),d=[b])}g(),c=[]},a=0;for(;a<r.length;){let l=r[a];if(/^[-_*]{3,}\s*$/.test(l)){u(),a++;continue}let m=l.match(/^(#{1,4})\s+(.+)$/);if(m){u();let p=m[1].length,d=m[2].trim();for(;s.length>0&&s[s.length-1].level>=p;)s.pop();s.push({level:p,text:d}),i=d,c.push(l),a++;continue}let h=l.match(/^(`{3,})(.*)?$/);if(h){let p=h[1],d=[l];for(a++;a<r.length;){if(d.push(r[a]),r[a].startsWith(p)&&r[a].trim()===p){a++;break}a++}c.push(...d);continue}c.push(l),a++}return u(),n}#_(t,e){let n=t.split(/\n\s*\n/);if(n.length>=3&&n.length<=200&&n.every(u=>Buffer.byteLength(u)<5e3))return n.map((u,a)=>{let l=u.trim();return{title:l.split(`
`)[0].slice(0,80)||`Section ${a+1}`,content:l}}).filter(u=>u.content.length>0);let r=t.split(`
`);if(r.length<=e)return[{title:"Output",content:t}];let s=[],i=Math.max(e-2,1);for(let u=0;u<r.length;u+=i){let a=r.slice(u,u+e);if(a.length===0)break;let l=u+1,m=Math.min(u+a.length,r.length),h=a[0]?.trim().slice(0,80);s.push({title:h||`Lines ${l}-${m}`,content:a.join(`
`)})}return s}#k(t,e,n,r){let s=e.length>0?e.join(" > "):"(root)",c=JSON.stringify(t,null,2);if(Buffer.byteLength(c)<=r&&!(typeof t=="object"&&t!==null&&!Array.isArray(t)&&Object.values(t).some(u=>typeof u=="object"&&u!==null))){n.push({title:s,content:c,hasCode:!0});return}if(typeof t=="object"&&t!==null&&!Array.isArray(t)){let i=Object.entries(t);if(i.length>0){for(let[u,a]of i)this.#k(a,[...e,u],n,r);return}n.push({title:s,content:c,hasCode:!0});return}if(Array.isArray(t)){this.#O(t,e,n,r);return}n.push({title:s,content:c,hasCode:!1})}#C(t){if(t.length===0)return null;let e=t[0];if(typeof e!="object"||e===null||Array.isArray(e))return null;let n=["id","name","title","path","slug","key","label"],r=e;for(let s of n)if(s in r&&(typeof r[s]=="string"||typeof r[s]=="number"))return s;return null}#N(t,e,n,r,s){let c=t?`${t} > `:"";if(!s)return e===n?`${c}[${e}]`:`${c}[${e}-${n}]`;let i=u=>String(u[s]);return r.length===1?`${c}${i(r[0])}`:r.length<=3?c+r.map(i).join(", "):`${c}${i(r[0])}\u2026${i(r[r.length-1])}`}#O(t,e,n,r){let s=e.length>0?e.join(" > "):"(root)",c=this.#C(t),i=[],u=0,a=l=>{if(i.length===0)return;let m=this.#N(s,u,l,i,c);n.push({title:m,content:JSON.stringify(i,null,2),hasCode:!0})};for(let l=0;l<t.length;l++){i.push(t[l]);let m=JSON.stringify(i,null,2);Buffer.byteLength(m)>r&&i.length>1&&(i.pop(),a(l-1),i=[t[l]],u=l)}a(u+i.length-1)}#A(t,e){return t.length===0?e||"Untitled":t.map(n=>n.text).join(" > ")}};function O(o){let t=T(o);for(;;){let e=N(t,".claude","context-mode.json");try{let r=C(e,"utf-8");return{config:JSON.parse(r),configPath:e}}catch{}let n=Y(t);if(n===t)break;t=n}return null}function K(o,t){let e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`).test(o)}function A(o,t,e){let n=[];try{let r=J(o);for(let s of r){let c=N(o,s);try{let i=X(c);i.isDirectory()&&e?n.push(...A(c,t,!0)):i.isFile()&&K(s,t)&&n.push(c)}catch{}}}catch{}return n}function k(o,t){try{let e=C(o,"utf-8");return e.trim().length===0?null:{name:t?G(t,o):q(o),path:o,content:e}}catch{return null}}function Q(o){if(o.paths){let t=o.path||".";return o.paths.map(e=>T(t,e)).map(e=>k(e,t)).filter(e=>e!==null)}if(o.exec){let t=o.path||process.cwd();try{let e=V(o.exec,{cwd:t,encoding:"utf-8",timeout:1e4}).trim(),n=JSON.parse(e);return Array.isArray(n)?n.map(r=>T(t,r)).map(r=>k(r,t)).filter(r=>r!==null):(process.stderr.write(`[context-wrapper] exec for "${o.label}" did not return an array
`),[])}catch(e){return process.stderr.write(`[context-wrapper] exec for "${o.label}" failed: ${e.message}
`),[]}}return o.glob&&o.path?A(o.path,o.glob,!!o.recursive).map(t=>k(t,o.path)).filter(t=>t!==null):(process.stderr.write(`[context-wrapper] source "${o.label}" has no file selection strategy (need glob+path, exec, or paths)
`),[])}function Z(o){if(!o.startsWith("---"))return o;let t=o.indexOf(`
---`,3);return t===-1?o:o.slice(t+4).replace(/^\n+/,"")}function tt(o,t){let e=t.match(/^(\d{4}-\d{2}-\d{2})\.md$/);if(!e)return o;let n=e[1],r=o.split(`
`),s=[];for(let c of r){if(/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(c))continue;let i=c.match(/^(##\s+)(.+)$/);i?s.push(`${i[1]}[${n}] ${i[2]}`):s.push(c)}return s.join(`
`)}function et(o){return o.replace(/\n{3,}/g,`

`)}function nt(o,t){let e=o.content;return t.stripFrontmatter&&(e=Z(e)),t.prefixDates&&(e=tt(e,o.name)),e=et(e),e}function L(o,t){let e=new y(t),n=0,r=0;for(let s of o.sources){let c=Q(s);if(c.length!==0)for(let i of c){let u=nt(i,s);if(u.trim().length===0)continue;let a=`${s.label}: ${i.name}`,l=e.index({content:u,source:a});n++,r+=l.totalChunks}}return{totalSources:n,totalChunks:r}}var F={execute:"ctx_execute",index:"ctx_index",search:"ctx_search",fetch_and_index:"ctx_fetch_and_index",batch_execute:"ctx_batch_execute"},v=new Map(Object.entries(F).map(([o,t])=>[t,o])),ht=new Set(["ctx_stats","ctx_doctor","ctx_upgrade"]);async function pt(){let o=D(st(import.meta.url)),t=o.endsWith("/src")?D(o):o,e=I(t,"node_modules","context-mode","server.bundle.mjs"),n=new ct({command:"node",args:[e],env:{...process.env},stderr:"inherit"}),r=new at({name:"context-wrapper",version:"0.1.0"});await r.connect(n);let s=n.pid;if(!s)throw new Error("Failed to get upstream server PID");process.stderr.write(`[context-wrapper] Connected to upstream server (pid ${s})
`);let c=O(process.cwd());if(c){let p=I(rt(),`context-mode-${s}.db`),d=performance.now(),f=L(c.config,p),g=(performance.now()-d).toFixed(0);process.stderr.write(`[context-wrapper] Pre-warmed ${f.totalChunks} chunks from ${f.totalSources} files in ${g}ms
`)}let{tools:i}=await r.listTools(),u=i.find(p=>p.name==="ctx_execute_file"),a=i.filter(p=>!ht.has(p.name)).filter(p=>p.name!=="ctx_execute_file").filter(p=>v.has(p.name)).map(p=>{let d=v.get(p.name);if(d==="execute"&&u){let f={...p.inputSchema.properties??{}};return u.inputSchema.properties?.path?f.path=u.inputSchema.properties.path:f.path={type:"string",description:"Absolute file path or relative to project root. When provided, reads this file into a FILE_CONTENT variable inside the sandbox \u2014 file contents stay in sandbox, only your printed output enters context."},{...p,name:d,description:(p.description??"")+"\n\nWhen `path` is provided, reads the file at that path into a FILE_CONTENT variable inside the sandbox. The full file contents do NOT enter context \u2014 only what you print. Use instead of Read/cat for log files, data files, large source files, or any file where you need to extract specific information rather than read the entire content.",inputSchema:{...p.inputSchema,properties:f}}}return{...p,name:d}}),l=new ot({name:"context-wrapper",version:"0.1.0"},{capabilities:{tools:{}}});l.setRequestHandler(lt,async()=>({tools:a})),l.setRequestHandler(ut,async p=>{let{name:d,arguments:f}=p.params,g;return d==="execute"&&f?.path!==void 0?g="ctx_execute_file":g=F[d],g?await r.callTool({name:g,arguments:f}):{content:[{type:"text",text:`Unknown tool: ${d}`}],isError:!0}});let m=new it;await l.connect(m),process.stderr.write(`[context-wrapper] MCP server ready (${a.length} tools)
`);let h=async()=>{await Promise.allSettled([r.close(),l.close()])};process.stdin.on("end",()=>process.exit(0)),process.on("SIGINT",async()=>{await h(),process.exit(0)}),process.on("SIGTERM",async()=>{await h(),process.exit(0)}),process.on("exit",()=>{try{process.kill(s)}catch{}})}pt().catch(o=>{process.stderr.write(`[context-wrapper] Fatal: ${o.message}
${o.stack}
`),process.exit(1)});
