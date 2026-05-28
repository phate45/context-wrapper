import{join as G,dirname as K,basename as xt,resolve as j}from"node:path";import{tmpdir as Et}from"node:os";import{readFileSync as kt,statSync as wt}from"node:fs";import{randomBytes as Rt}from"node:crypto";import{fileURLToPath as Tt}from"node:url";import{Server as _t}from"@modelcontextprotocol/sdk/server/index.js";import{StdioServerTransport as Ct}from"@modelcontextprotocol/sdk/server/stdio.js";import{Client as Nt}from"@modelcontextprotocol/sdk/client/index.js";import{StdioClientTransport as At}from"@modelcontextprotocol/sdk/client/stdio.js";import{ListToolsRequestSchema as Ot,CallToolRequestSchema as It}from"@modelcontextprotocol/sdk/types.js";import{readFileSync as J,readdirSync as ut,statSync as ht}from"node:fs";import{execSync as pt}from"node:child_process";import{join as X,dirname as dt,basename as mt,resolve as F,relative as ft}from"node:path";import{createRequire as et}from"node:module";var v=null;function z(){return v||(v=et(import.meta.url)("better-sqlite3")),v}function W(s){s.pragma("journal_mode = WAL"),s.pragma("synchronous = NORMAL")}import{readFileSync as nt,readdirSync as Wt,unlinkSync as rt}from"node:fs";import{tmpdir as st}from"node:os";import{join as ot}from"node:path";var H=new Set(["the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","has","his","how","its","may","new","now","old","see","way","who","did","get","got","let","say","she","too","use","will","with","this","that","from","they","been","have","many","some","them","than","each","make","like","just","over","such","take","into","year","your","good","could","would","about","which","their","there","other","after","should","through","also","more","most","only","very","when","what","then","these","those","being","does","done","both","same","still","while","where","here","were","much","update","updates","updated","deps","dev","tests","test","add","added","fix","fixed","run","running","using"]);function it(s,t="AND"){let e=s.replace(/['"(){}[\]*:^~]/g," ").split(/\s+/).filter(n=>n.length>0&&!["AND","OR","NOT","NEAR"].includes(n.toUpperCase()));return e.length===0?'""':e.map(n=>`"${n}"`).join(t==="OR"?" OR ":" ")}function at(s,t="AND"){let e=s.replace(/["'(){}[\]*:^~]/g,"").trim();if(e.length<3)return"";let n=e.split(/\s+/).filter(r=>r.length>=3);return n.length===0?"":n.map(r=>`"${r}"`).join(t==="OR"?" OR ":" ")}function ct(s,t){if(s.length===0)return t.length;if(t.length===0)return s.length;let e=Array.from({length:t.length+1},(n,r)=>r);for(let n=1;n<=s.length;n++){let r=[n];for(let o=1;o<=t.length;o++)r[o]=s[n-1]===t[o-1]?e[o-1]:1+Math.min(e[o],r[o-1],e[o-1]);e=r}return e[t.length]}function lt(s){return s<=4?1:s<=12?2:3}var q=4096;var L=class{#t;#n;#r;#s;#o;#i;#a;#c;#l;#u;#h;#p;#d;#m;#f;#g;#y;#b;#S;#x;constructor(t){let e=z();this.#n=t??ot(st(),`context-mode-${process.pid}.db`),this.#t=new e(this.#n,{timeout:5e3}),W(this.#t),this.#k(),this.#w()}cleanup(){try{this.#t.close()}catch{}for(let t of["","-wal","-shm"])try{rt(this.#n+t)}catch{}}#k(){this.#t.exec(`
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
    `),this.#f=this.#t.prepare("SELECT word FROM vocabulary WHERE length(word) BETWEEN ? AND ?"),this.#g=this.#t.prepare("SELECT label, chunk_count as chunkCount FROM sources ORDER BY id DESC"),this.#y=this.#t.prepare(`SELECT c.title, c.content, c.content_type, s.label
       FROM chunks c
       JOIN sources s ON s.id = c.source_id
       WHERE c.source_id = ?
       ORDER BY c.rowid`),this.#b=this.#t.prepare("SELECT chunk_count FROM sources WHERE id = ?"),this.#S=this.#t.prepare("SELECT content FROM chunks WHERE source_id = ?"),this.#x=this.#t.prepare(`
      SELECT
        (SELECT COUNT(*) FROM sources) AS sources,
        (SELECT COUNT(*) FROM chunks) AS chunks,
        (SELECT COUNT(*) FROM chunks WHERE content_type = 'code') AS codeChunks
    `)}index(t){let{content:e,path:n,source:r}=t;if(!e&&!n)throw new Error("Either content or path must be provided");let o=e??nt(n,"utf-8"),c=r??n??"untitled",i=this.#T(o);return this.#e(i,c,o)}indexPlainText(t,e,n=20){if(!t||t.trim().length===0)return this.#e([],e,"");let r=this.#_(t,n);return this.#e(r.map(o=>({...o,hasCode:!1})),e,t)}indexJSON(t,e,n=q){if(!t||t.trim().length===0)return this.indexPlainText("",e);let r;try{r=JSON.parse(t)}catch{return this.indexPlainText(t,e)}let o=[];return this.#E(r,[],o,n),o.length===0?this.indexPlainText(t,e):this.#e(o,e,t)}#e(t,e,n){let r=t.filter(i=>i.hasCode).length,c=this.#t.transaction(()=>{if(this.#c.run(e),this.#l.run(e),this.#u.run(e),t.length===0){let a=this.#r.run(e);return Number(a.lastInsertRowid)}let i=this.#s.run(e,t.length,r),u=Number(i.lastInsertRowid);for(let a of t){let l=a.hasCode?"code":"prose";this.#o.run(a.title,a.content,u,l),this.#i.run(a.title,a.content,u,l)}return u})();return n&&this.#R(n),{sourceId:c,label:e,totalChunks:t.length,codeChunks:r}}search(t,e=3,n,r="AND"){let o=it(t,r),c=n?this.#p:this.#h,i=n?[o,`%${n}%`,e]:[o,e];return c.all(...i).map(a=>({title:a.title,content:a.content,source:a.label,rank:a.rank,contentType:a.content_type,highlighted:a.highlighted}))}searchTrigram(t,e=3,n,r="AND"){let o=at(t,r);if(!o)return[];let c=n?this.#m:this.#d,i=n?[o,`%${n}%`,e]:[o,e];return c.all(...i).map(a=>({title:a.title,content:a.content,source:a.label,rank:a.rank,contentType:a.content_type,highlighted:a.highlighted}))}fuzzyCorrect(t){let e=t.toLowerCase().trim();if(e.length<3)return null;let n=lt(e.length),r=this.#f.all(e.length-n,e.length+n),o=null,c=n+1;for(let{word:i}of r){if(i===e)return null;let u=ct(e,i);u<c&&(c=u,o=i)}return c<=n?o:null}searchWithFallback(t,e=3,n){let r=this.search(t,e,n,"AND");if(r.length>0)return r.map(h=>({...h,matchLayer:"porter"}));let o=this.search(t,e,n,"OR");if(o.length>0)return o.map(h=>({...h,matchLayer:"porter"}));let c=this.searchTrigram(t,e,n,"AND");if(c.length>0)return c.map(h=>({...h,matchLayer:"trigram"}));let i=this.searchTrigram(t,e,n,"OR");if(i.length>0)return i.map(h=>({...h,matchLayer:"trigram"}));let u=t.toLowerCase().trim().split(/\s+/).filter(h=>h.length>=3),a=u.join(" "),m=u.map(h=>this.fuzzyCorrect(h)??h).join(" ");if(m!==a){let h=this.search(m,e,n,"AND");if(h.length>0)return h.map(y=>({...y,matchLayer:"fuzzy"}));let p=this.search(m,e,n,"OR");if(p.length>0)return p.map(y=>({...y,matchLayer:"fuzzy"}));let d=this.searchTrigram(m,e,n,"AND");if(d.length>0)return d.map(y=>({...y,matchLayer:"fuzzy"}));let f=this.searchTrigram(m,e,n,"OR");if(f.length>0)return f.map(y=>({...y,matchLayer:"fuzzy"}))}return[]}listSources(){return this.#g.all()}getChunksBySource(t){return this.#y.all(t).map(n=>({title:n.title,content:n.content,source:n.label,rank:0,contentType:n.content_type}))}getDistinctiveTerms(t,e=40){let n=this.#b.get(t);if(!n||n.chunk_count<3)return[];let r=n.chunk_count,o=2,c=Math.max(3,Math.ceil(r*.4)),i=new Map;for(let l of this.#S.iterate(t)){let m=new Set(l.content.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(h=>h.length>=3&&!H.has(h)));for(let h of m)i.set(h,(i.get(h)??0)+1)}return Array.from(i.entries()).filter(([,l])=>l>=o&&l<=c).map(([l,m])=>{let h=Math.log(r/m),p=Math.min(l.length/20,.5),d=/[_]/.test(l),f=l.length>=12,y=d?1.5:f?.8:0;return{word:l,score:h+p+y}}).sort((l,m)=>m.score-l.score).slice(0,e).map(l=>l.word)}getStats(){let t=this.#x.get();return{sources:t?.sources??0,chunks:t?.chunks??0,codeChunks:t?.codeChunks??0}}close(){this.#t.close()}#R(t){let e=t.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(r=>r.length>=3&&!H.has(r)),n=[...new Set(e)];this.#t.transaction(()=>{for(let r of n)this.#a.run(r)})()}#T(t,e=q){let n=[],r=t.split(`
`),o=[],c=[],i="",u=()=>{let l=c.join(`
`).trim();if(l.length===0)return;let m=this.#O(o,i),h=c.some(S=>/^`{3,}/.test(S));if(Buffer.byteLength(l)<=e){n.push({title:m,content:l,hasCode:h}),c=[];return}let p=l.split(/\n\n+/),d=[],f=1,y=()=>{if(d.length===0)return;let S=d.join(`

`).trim();if(S.length===0)return;let g=p.length>1?`${m} (${f})`:m;f++,n.push({title:g,content:S,hasCode:S.includes("```")}),d=[]};for(let S of p){d.push(S);let g=d.join(`

`);Buffer.byteLength(g)>e&&d.length>1&&(d.pop(),y(),d=[S])}y(),c=[]},a=0;for(;a<r.length;){let l=r[a];if(/^[-_*]{3,}\s*$/.test(l)){u(),a++;continue}let m=l.match(/^(#{1,4})\s+(.+)$/);if(m){u();let p=m[1].length,d=m[2].trim();for(;o.length>0&&o[o.length-1].level>=p;)o.pop();o.push({level:p,text:d}),i=d,c.push(l),a++;continue}let h=l.match(/^(`{3,})(.*)?$/);if(h){let p=h[1],d=[l];for(a++;a<r.length;){if(d.push(r[a]),r[a].startsWith(p)&&r[a].trim()===p){a++;break}a++}c.push(...d);continue}c.push(l),a++}return u(),n}#_(t,e){let n=t.split(/\n\s*\n/);if(n.length>=3&&n.length<=200&&n.every(u=>Buffer.byteLength(u)<5e3))return n.map((u,a)=>{let l=u.trim();return{title:l.split(`
`)[0].slice(0,80)||`Section ${a+1}`,content:l}}).filter(u=>u.content.length>0);let r=t.split(`
`);if(r.length<=e)return[{title:"Output",content:t}];let o=[],i=Math.max(e-2,1);for(let u=0;u<r.length;u+=i){let a=r.slice(u,u+e);if(a.length===0)break;let l=u+1,m=Math.min(u+a.length,r.length),h=a[0]?.trim().slice(0,80);o.push({title:h||`Lines ${l}-${m}`,content:a.join(`
`)})}return o}#E(t,e,n,r){let o=e.length>0?e.join(" > "):"(root)",c=JSON.stringify(t,null,2);if(Buffer.byteLength(c)<=r&&!(typeof t=="object"&&t!==null&&!Array.isArray(t)&&Object.values(t).some(u=>typeof u=="object"&&u!==null))){n.push({title:o,content:c,hasCode:!0});return}if(typeof t=="object"&&t!==null&&!Array.isArray(t)){let i=Object.entries(t);if(i.length>0){for(let[u,a]of i)this.#E(a,[...e,u],n,r);return}n.push({title:o,content:c,hasCode:!0});return}if(Array.isArray(t)){this.#A(t,e,n,r);return}n.push({title:o,content:c,hasCode:!1})}#C(t){if(t.length===0)return null;let e=t[0];if(typeof e!="object"||e===null||Array.isArray(e))return null;let n=["id","name","title","path","slug","key","label"],r=e;for(let o of n)if(o in r&&(typeof r[o]=="string"||typeof r[o]=="number"))return o;return null}#N(t,e,n,r,o){let c=t?`${t} > `:"";if(!o)return e===n?`${c}[${e}]`:`${c}[${e}-${n}]`;let i=u=>String(u[o]);return r.length===1?`${c}${i(r[0])}`:r.length<=3?c+r.map(i).join(", "):`${c}${i(r[0])}\u2026${i(r[r.length-1])}`}#A(t,e,n,r){let o=e.length>0?e.join(" > "):"(root)",c=this.#C(t),i=[],u=0,a=l=>{if(i.length===0)return;let m=this.#N(o,u,l,i,c);n.push({title:m,content:JSON.stringify(i,null,2),hasCode:!0})};for(let l=0;l<t.length;l++){i.push(t[l]);let m=JSON.stringify(i,null,2);Buffer.byteLength(m)>r&&i.length>1&&(i.pop(),a(l-1),i=[t[l]],u=l)}a(u+i.length-1)}#O(t,e){return t.length===0?e||"Untitled":t.map(n=>n.text).join(" > ")}};function Y(s){let t=F(s);for(;;){let e=X(t,".claude","context-mode.json");try{let r=J(e,"utf-8");return{config:JSON.parse(r),configPath:e}}catch{}let n=dt(t);if(n===t)break;t=n}return null}function gt(s,t){let e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`).test(s)}function D(s,t,e){let n=[];try{let r=ut(s);for(let o of r){let c=X(s,o);try{let i=ht(c);i.isDirectory()&&e?n.push(...D(c,t,!0)):i.isFile()&&gt(o,t)&&n.push(c)}catch{}}}catch{}return n}function A(s,t){try{let e=J(s,"utf-8");return e.trim().length===0?null:{name:t?ft(t,s):mt(s),path:s,content:e}}catch{return null}}function yt(s){if(s.paths){let t=s.path||".";return s.paths.map(e=>F(t,e)).map(e=>A(e,t)).filter(e=>e!==null)}if(s.exec){let t=s.path||process.cwd();try{let e=pt(s.exec,{cwd:t,encoding:"utf-8",timeout:1e4}).trim(),n=JSON.parse(e);return Array.isArray(n)?n.map(r=>F(t,r)).map(r=>A(r,t)).filter(r=>r!==null):(process.stderr.write(`[context-wrapper] exec for "${s.label}" did not return an array
`),[])}catch(e){return process.stderr.write(`[context-wrapper] exec for "${s.label}" failed: ${e.message}
`),[]}}return s.glob&&s.path?D(s.path,s.glob,!!s.recursive).map(t=>A(t,s.path)).filter(t=>t!==null):(process.stderr.write(`[context-wrapper] source "${s.label}" has no file selection strategy (need glob+path, exec, or paths)
`),[])}function P(s){if(!s.startsWith("---"))return s;let t=s.indexOf(`
---`,3);return t===-1?s:s.slice(t+4).replace(/^\n+/,"")}function bt(s,t){let e=t.match(/^(\d{4}-\d{2}-\d{2})\.md$/);if(!e)return s;let n=e[1],r=s.split(`
`),o=[];for(let c of r){if(/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(c))continue;let i=c.match(/^(##\s+)(.+)$/);i?o.push(`${i[1]}[${n}] ${i[2]}`):o.push(c)}return o.join(`
`)}function M(s){return s.replace(/\n{3,}/g,`

`)}function St(s,t){let e=s.content;return t.stripFrontmatter&&(e=P(e)),t.prefixDates&&(e=bt(e,s.name)),e=M(e),e}function V(s,t){let e=new L(t),n=0,r=0;for(let o of s.sources){let c=yt(o);if(c.length!==0)for(let i of c){let u=St(i,o);if(u.trim().length===0)continue;let a=`${o.label}: ${i.name}`,l=e.index({content:u,source:a});n++,r+=l.totalChunks}}return{totalSources:n,totalChunks:r}}var Z={execute:"ctx_execute",index:"ctx_index",search:"ctx_search",fetch_and_index:"ctx_fetch_and_index",batch_execute:"ctx_batch_execute"},Q=new Map(Object.entries(Z).map(([s,t])=>[t,s])),Lt=new Set(["ctx_stats","ctx_doctor","ctx_upgrade"]),Dt={name:"index_folder",description:`Index all matching files in a directory into the searchable BM25 knowledge base. Each file becomes a separate indexed source with its own label, enabling per-file search results. Re-indexing the same folder replaces previous content (dedup by label).

Use for: documentation directories, note folders, code reference collections, any set of files you want searchable as a unit.
After indexing, use 'search' to retrieve specific sections on-demand.`,inputSchema:{type:"object",properties:{path:{type:"string",description:"Absolute or relative path to the directory to index."},glob:{type:"string",description:'Filename pattern to match (e.g. "*.md", "*.txt"). Defaults to "*.md".'},recursive:{type:"boolean",description:"Whether to walk subdirectories. Defaults to true."},source:{type:"string",description:'Label prefix for indexed content. Each file gets "{source}: {relative/path}". Defaults to the directory basename.'},stripFrontmatter:{type:"boolean",description:"Strip YAML frontmatter (---/---) from file starts before indexing. Defaults to true."}},required:["path"]}},$t=new Set(["apps","packages","src","lib"]);function vt(s){let t=s.split("/").filter(Boolean),e=-1;for(let r=t.length-1;r>=0;r--)if($t.has(t[r])){e=r;break}let n=e>=0?t.slice(e+1):t.slice(-2);return n=n.filter(r=>r!=="src"),n.join("/")}function Ft(s){let t=new Map;return s.map(e=>{let n=(t.get(e)??0)+1;return t.set(e,n),n>1?`${e} (${n})`:e})}async function Pt(){let s=K(Tt(import.meta.url)),t=s.endsWith("/src")?K(s):s,e=G(t,"node_modules","context-mode","server.bundle.mjs"),n=new At({command:"node",args:[e],env:{...process.env,CLAUDE_PROJECT_DIR:process.cwd()},stderr:"inherit"}),r=new Nt({name:"context-wrapper",version:"0.2.0"});await r.connect(n);let o=n.pid;if(!o)throw new Error("Failed to get upstream server PID");process.stderr.write(`[context-wrapper] Connected to upstream server (pid ${o})
`);let c=Y(process.cwd());if(c){let p=G(Et(),`context-mode-${o}.db`),d=performance.now(),f=V(c.config,p),y=(performance.now()-d).toFixed(0);process.stderr.write(`[context-wrapper] Pre-warmed ${f.totalChunks} chunks from ${f.totalSources} files in ${y}ms
`)}let{tools:i}=await r.listTools(),u=i.find(p=>p.name==="ctx_execute_file"),a=i.filter(p=>!Lt.has(p.name)).filter(p=>p.name!=="ctx_execute_file").filter(p=>Q.has(p.name)).map(p=>{let d=Q.get(p.name);if(d==="execute"&&u){let f={...p.inputSchema.properties??{}};return u.inputSchema.properties?.path?f.path=u.inputSchema.properties.path:f.path={type:"string",description:"Absolute file path or relative to project root. When provided, reads this file into a FILE_CONTENT variable inside the sandbox \u2014 file contents stay in sandbox, only your printed output enters context."},{...p,name:d,description:(p.description??"")+"\n\nWhen `path` is provided, reads the file at that path into a FILE_CONTENT variable inside the sandbox. The full file contents do NOT enter context \u2014 only what you print. Use instead of Read/cat for log files, data files, large source files, or any file where you need to extract specific information rather than read the entire content.",inputSchema:{...p.inputSchema,properties:f}}}return{...p,name:d}});a.push(Dt),a.push({name:"batch_read",description:"Read multiple files, index them, and search across their contents. Use instead of batch_execute when all inputs are known file paths (no shell commands needed). Labels are auto-derived from file paths. Returns BM25 search results plus a batch ID \u2014 pass the batch ID as `source` to `search` for follow-up questions scoped to exactly these files.",inputSchema:{type:"object",properties:{files:{type:"array",items:{type:"string"},description:"File paths to read and index. Absolute paths preferred; relative paths resolve from the current working directory.",minItems:1},queries:{type:"array",items:{type:"string"},description:"Search queries to run against the indexed content. Use 5\u20138 comprehensive queries. Each returns top matching sections.",minItems:1}},required:["files","queries"],additionalProperties:!1}});let l=new _t({name:"context-wrapper",version:"0.2.0"},{capabilities:{tools:{}}});l.setRequestHandler(Ot,async()=>({tools:a})),l.setRequestHandler(It,async p=>{let{name:d,arguments:f}=p.params;if(d==="index_folder"){let g=j(String(f?.path??"")),k=String(f?.glob??"*.md"),b=f?.recursive!==!1,w=f?.stripFrontmatter!==!1,C=String(f?.source??xt(g)),R=!1;try{R=wt(g).isDirectory()}catch{}if(!R)return{content:[{type:"text",text:`Error: "${g}" is not a directory.`}],isError:!0};let $=D(g,k,b);if($.length===0)return{content:[{type:"text",text:`No files matching "${k}" found in ${g}.`}]};let N=0,O=0,T=[];for(let I of $){let _=A(I,g);if(!_)continue;let E=_.content;if(w&&(E=P(E)),E=M(E),E.trim().length===0)continue;let tt=`${C}: ${_.name}`;try{let B=((await r.callTool({name:"ctx_index",arguments:{content:E,source:tt}}))?.content?.[0]?.text??"").match(/^Indexed (\d+) sections/);B&&(O+=parseInt(B[1],10)),N++}catch(U){T.push(`${_.name}: ${U.message}`)}}return{content:[{type:"text",text:`Indexed ${N} file${N!==1?"s":""} (${O} chunks) from ${g}`+(T.length>0?`

Errors (${T.length}):
${T.join(`
`)}`:"")}]}}if(d==="batch_read"){let{files:g,queries:k}=f,b=Rt(3).toString("hex"),w=g.map(x=>vt(j(x))),C=Ft(w),R=[];for(let x=0;x<g.length;x++){let I=j(g[x]),_=`${b}/${C[x]}`,E;try{E=kt(I,"utf-8")}catch{R.push(I);continue}await r.callTool({name:"ctx_index",arguments:{content:E,source:_}})}let N=(await r.callTool({name:"ctx_search",arguments:{queries:k,source:b,limit:3}})).content?.[0]?.text??"(no results)",O=R.length>0?`

\u26A0 Could not read ${R.length} file(s):
${R.map(x=>`  - ${x}`).join(`
`)}`:"",T=`

---
**Batch ID:** \`${b}\`
To search only these files: \`search(queries: [...], source: "${b}")\``;return{content:[{type:"text",text:N+O+T}]}}let y;if(d==="execute"&&f?.path!==void 0?y="ctx_execute_file":y=Z[d],!y)return{content:[{type:"text",text:`Unknown tool: ${d}`}],isError:!0};let S=await r.callTool({name:y,arguments:f});if(d==="search"&&c?.config.searchReminder!==void 0){let g=c.config.searchReminder,k=S.content;if(Array.isArray(k))for(let b of k){if(b.type!=="text"||typeof b.text!="string")continue;let w=/\n\n⚠ search call #\d+\/\d+ in this window\..+$/s,C=/^BLOCKED: \d+ search calls in \d+s\..+$/s;w.test(b.text)?b.text=g===!1?b.text.replace(w,""):b.text.replace(w,`

${g}`):C.test(b.text)&&(b.text=g===!1?"":String(g))}}return S});let m=new Ct;await l.connect(m),process.stderr.write(`[context-wrapper] MCP server ready (${a.length} tools)
`);let h=async()=>{await Promise.allSettled([r.close(),l.close()])};process.stdin.on("end",()=>process.exit(0)),process.on("SIGINT",async()=>{await h(),process.exit(0)}),process.on("SIGTERM",async()=>{await h(),process.exit(0)}),process.on("exit",()=>{try{process.kill(o)}catch{}})}Pt().catch(s=>{process.stderr.write(`[context-wrapper] Fatal: ${s.message}
${s.stack}
`),process.exit(1)});
