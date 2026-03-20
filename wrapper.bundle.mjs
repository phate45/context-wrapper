import{join as Y,dirname as V,basename as yt,resolve as St}from"node:path";import{statSync as Et}from"node:fs";import{tmpdir as xt}from"node:os";import{fileURLToPath as kt}from"node:url";import{Server as wt}from"@modelcontextprotocol/sdk/server/index.js";import{StdioServerTransport as Rt}from"@modelcontextprotocol/sdk/server/stdio.js";import{Client as Tt}from"@modelcontextprotocol/sdk/client/index.js";import{StdioClientTransport as _t}from"@modelcontextprotocol/sdk/client/stdio.js";import{ListToolsRequestSchema as Ct,CallToolRequestSchema as Nt}from"@modelcontextprotocol/sdk/types.js";import{readFileSync as W,readdirSync as ct,statSync as lt}from"node:fs";import{execSync as ut}from"node:child_process";import{join as H,dirname as ht,basename as pt,resolve as L,relative as dt}from"node:path";import{createRequire as Z}from"node:module";var O=null;function j(){return O||(O=Z(import.meta.url)("better-sqlite3")),O}function U(o){o.pragma("journal_mode = WAL"),o.pragma("synchronous = NORMAL")}import{readFileSync as tt,readdirSync as Mt,unlinkSync as et}from"node:fs";import{tmpdir as nt}from"node:os";import{join as rt}from"node:path";var B=new Set(["the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","has","his","how","its","may","new","now","old","see","way","who","did","get","got","let","say","she","too","use","will","with","this","that","from","they","been","have","many","some","them","than","each","make","like","just","over","such","take","into","year","your","good","could","would","about","which","their","there","other","after","should","through","also","more","most","only","very","when","what","then","these","those","being","does","done","both","same","still","while","where","here","were","much","update","updates","updated","deps","dev","tests","test","add","added","fix","fixed","run","running","using"]);function st(o,t="AND"){let e=o.replace(/['"(){}[\]*:^~]/g," ").split(/\s+/).filter(n=>n.length>0&&!["AND","OR","NOT","NEAR"].includes(n.toUpperCase()));return e.length===0?'""':e.map(n=>`"${n}"`).join(t==="OR"?" OR ":" ")}function ot(o,t="AND"){let e=o.replace(/["'(){}[\]*:^~]/g,"").trim();if(e.length<3)return"";let n=e.split(/\s+/).filter(r=>r.length>=3);return n.length===0?"":n.map(r=>`"${r}"`).join(t==="OR"?" OR ":" ")}function it(o,t){if(o.length===0)return t.length;if(t.length===0)return o.length;let e=Array.from({length:t.length+1},(n,r)=>r);for(let n=1;n<=o.length;n++){let r=[n];for(let s=1;s<=t.length;s++)r[s]=o[n-1]===t[s-1]?e[s-1]:1+Math.min(e[s],r[s-1],e[s-1]);e=r}return e[t.length]}function at(o){return o<=4?1:o<=12?2:3}var z=4096;var _=class{#t;#n;#r;#s;#o;#i;#a;#c;#l;#u;#h;#p;#d;#m;#f;#g;#b;#y;#S;#E;constructor(t){let e=j();this.#n=t??rt(nt(),`context-mode-${process.pid}.db`),this.#t=new e(this.#n,{timeout:5e3}),U(this.#t),this.#k(),this.#w()}cleanup(){try{this.#t.close()}catch{}for(let t of["","-wal","-shm"])try{et(this.#n+t)}catch{}}#k(){this.#t.exec(`
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
    `),this.#f=this.#t.prepare("SELECT word FROM vocabulary WHERE length(word) BETWEEN ? AND ?"),this.#g=this.#t.prepare("SELECT label, chunk_count as chunkCount FROM sources ORDER BY id DESC"),this.#b=this.#t.prepare(`SELECT c.title, c.content, c.content_type, s.label
       FROM chunks c
       JOIN sources s ON s.id = c.source_id
       WHERE c.source_id = ?
       ORDER BY c.rowid`),this.#y=this.#t.prepare("SELECT chunk_count FROM sources WHERE id = ?"),this.#S=this.#t.prepare("SELECT content FROM chunks WHERE source_id = ?"),this.#E=this.#t.prepare(`
      SELECT
        (SELECT COUNT(*) FROM sources) AS sources,
        (SELECT COUNT(*) FROM chunks) AS chunks,
        (SELECT COUNT(*) FROM chunks WHERE content_type = 'code') AS codeChunks
    `)}index(t){let{content:e,path:n,source:r}=t;if(!e&&!n)throw new Error("Either content or path must be provided");let s=e??tt(n,"utf-8"),c=r??n??"untitled",i=this.#T(s);return this.#e(i,c,s)}indexPlainText(t,e,n=20){if(!t||t.trim().length===0)return this.#e([],e,"");let r=this.#_(t,n);return this.#e(r.map(s=>({...s,hasCode:!1})),e,t)}indexJSON(t,e,n=z){if(!t||t.trim().length===0)return this.indexPlainText("",e);let r;try{r=JSON.parse(t)}catch{return this.indexPlainText(t,e)}let s=[];return this.#x(r,[],s,n),s.length===0?this.indexPlainText(t,e):this.#e(s,e,t)}#e(t,e,n){let r=t.filter(i=>i.hasCode).length,c=this.#t.transaction(()=>{if(this.#c.run(e),this.#l.run(e),this.#u.run(e),t.length===0){let a=this.#r.run(e);return Number(a.lastInsertRowid)}let i=this.#s.run(e,t.length,r),u=Number(i.lastInsertRowid);for(let a of t){let l=a.hasCode?"code":"prose";this.#o.run(a.title,a.content,u,l),this.#i.run(a.title,a.content,u,l)}return u})();return n&&this.#R(n),{sourceId:c,label:e,totalChunks:t.length,codeChunks:r}}search(t,e=3,n,r="AND"){let s=st(t,r),c=n?this.#p:this.#h,i=n?[s,`%${n}%`,e]:[s,e];return c.all(...i).map(a=>({title:a.title,content:a.content,source:a.label,rank:a.rank,contentType:a.content_type,highlighted:a.highlighted}))}searchTrigram(t,e=3,n,r="AND"){let s=ot(t,r);if(!s)return[];let c=n?this.#m:this.#d,i=n?[s,`%${n}%`,e]:[s,e];return c.all(...i).map(a=>({title:a.title,content:a.content,source:a.label,rank:a.rank,contentType:a.content_type,highlighted:a.highlighted}))}fuzzyCorrect(t){let e=t.toLowerCase().trim();if(e.length<3)return null;let n=at(e.length),r=this.#f.all(e.length-n,e.length+n),s=null,c=n+1;for(let{word:i}of r){if(i===e)return null;let u=it(e,i);u<c&&(c=u,s=i)}return c<=n?s:null}searchWithFallback(t,e=3,n){let r=this.search(t,e,n,"AND");if(r.length>0)return r.map(h=>({...h,matchLayer:"porter"}));let s=this.search(t,e,n,"OR");if(s.length>0)return s.map(h=>({...h,matchLayer:"porter"}));let c=this.searchTrigram(t,e,n,"AND");if(c.length>0)return c.map(h=>({...h,matchLayer:"trigram"}));let i=this.searchTrigram(t,e,n,"OR");if(i.length>0)return i.map(h=>({...h,matchLayer:"trigram"}));let u=t.toLowerCase().trim().split(/\s+/).filter(h=>h.length>=3),a=u.join(" "),m=u.map(h=>this.fuzzyCorrect(h)??h).join(" ");if(m!==a){let h=this.search(m,e,n,"AND");if(h.length>0)return h.map(g=>({...g,matchLayer:"fuzzy"}));let p=this.search(m,e,n,"OR");if(p.length>0)return p.map(g=>({...g,matchLayer:"fuzzy"}));let d=this.searchTrigram(m,e,n,"AND");if(d.length>0)return d.map(g=>({...g,matchLayer:"fuzzy"}));let f=this.searchTrigram(m,e,n,"OR");if(f.length>0)return f.map(g=>({...g,matchLayer:"fuzzy"}))}return[]}listSources(){return this.#g.all()}getChunksBySource(t){return this.#b.all(t).map(n=>({title:n.title,content:n.content,source:n.label,rank:0,contentType:n.content_type}))}getDistinctiveTerms(t,e=40){let n=this.#y.get(t);if(!n||n.chunk_count<3)return[];let r=n.chunk_count,s=2,c=Math.max(3,Math.ceil(r*.4)),i=new Map;for(let l of this.#S.iterate(t)){let m=new Set(l.content.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(h=>h.length>=3&&!B.has(h)));for(let h of m)i.set(h,(i.get(h)??0)+1)}return Array.from(i.entries()).filter(([,l])=>l>=s&&l<=c).map(([l,m])=>{let h=Math.log(r/m),p=Math.min(l.length/20,.5),d=/[_]/.test(l),f=l.length>=12,g=d?1.5:f?.8:0;return{word:l,score:h+p+g}}).sort((l,m)=>m.score-l.score).slice(0,e).map(l=>l.word)}getStats(){let t=this.#E.get();return{sources:t?.sources??0,chunks:t?.chunks??0,codeChunks:t?.codeChunks??0}}close(){this.#t.close()}#R(t){let e=t.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(r=>r.length>=3&&!B.has(r)),n=[...new Set(e)];this.#t.transaction(()=>{for(let r of n)this.#a.run(r)})()}#T(t,e=z){let n=[],r=t.split(`
`),s=[],c=[],i="",u=()=>{let l=c.join(`
`).trim();if(l.length===0)return;let m=this.#O(s,i),h=c.some(y=>/^`{3,}/.test(y));if(Buffer.byteLength(l)<=e){n.push({title:m,content:l,hasCode:h}),c=[];return}let p=l.split(/\n\n+/),d=[],f=1,g=()=>{if(d.length===0)return;let y=d.join(`

`).trim();if(y.length===0)return;let b=p.length>1?`${m} (${f})`:m;f++,n.push({title:b,content:y,hasCode:y.includes("```")}),d=[]};for(let y of p){d.push(y);let b=d.join(`

`);Buffer.byteLength(b)>e&&d.length>1&&(d.pop(),g(),d=[y])}g(),c=[]},a=0;for(;a<r.length;){let l=r[a];if(/^[-_*]{3,}\s*$/.test(l)){u(),a++;continue}let m=l.match(/^(#{1,4})\s+(.+)$/);if(m){u();let p=m[1].length,d=m[2].trim();for(;s.length>0&&s[s.length-1].level>=p;)s.pop();s.push({level:p,text:d}),i=d,c.push(l),a++;continue}let h=l.match(/^(`{3,})(.*)?$/);if(h){let p=h[1],d=[l];for(a++;a<r.length;){if(d.push(r[a]),r[a].startsWith(p)&&r[a].trim()===p){a++;break}a++}c.push(...d);continue}c.push(l),a++}return u(),n}#_(t,e){let n=t.split(/\n\s*\n/);if(n.length>=3&&n.length<=200&&n.every(u=>Buffer.byteLength(u)<5e3))return n.map((u,a)=>{let l=u.trim();return{title:l.split(`
`)[0].slice(0,80)||`Section ${a+1}`,content:l}}).filter(u=>u.content.length>0);let r=t.split(`
`);if(r.length<=e)return[{title:"Output",content:t}];let s=[],i=Math.max(e-2,1);for(let u=0;u<r.length;u+=i){let a=r.slice(u,u+e);if(a.length===0)break;let l=u+1,m=Math.min(u+a.length,r.length),h=a[0]?.trim().slice(0,80);s.push({title:h||`Lines ${l}-${m}`,content:a.join(`
`)})}return s}#x(t,e,n,r){let s=e.length>0?e.join(" > "):"(root)",c=JSON.stringify(t,null,2);if(Buffer.byteLength(c)<=r&&!(typeof t=="object"&&t!==null&&!Array.isArray(t)&&Object.values(t).some(u=>typeof u=="object"&&u!==null))){n.push({title:s,content:c,hasCode:!0});return}if(typeof t=="object"&&t!==null&&!Array.isArray(t)){let i=Object.entries(t);if(i.length>0){for(let[u,a]of i)this.#x(a,[...e,u],n,r);return}n.push({title:s,content:c,hasCode:!0});return}if(Array.isArray(t)){this.#A(t,e,n,r);return}n.push({title:s,content:c,hasCode:!1})}#C(t){if(t.length===0)return null;let e=t[0];if(typeof e!="object"||e===null||Array.isArray(e))return null;let n=["id","name","title","path","slug","key","label"],r=e;for(let s of n)if(s in r&&(typeof r[s]=="string"||typeof r[s]=="number"))return s;return null}#N(t,e,n,r,s){let c=t?`${t} > `:"";if(!s)return e===n?`${c}[${e}]`:`${c}[${e}-${n}]`;let i=u=>String(u[s]);return r.length===1?`${c}${i(r[0])}`:r.length<=3?c+r.map(i).join(", "):`${c}${i(r[0])}\u2026${i(r[r.length-1])}`}#A(t,e,n,r){let s=e.length>0?e.join(" > "):"(root)",c=this.#C(t),i=[],u=0,a=l=>{if(i.length===0)return;let m=this.#N(s,u,l,i,c);n.push({title:m,content:JSON.stringify(i,null,2),hasCode:!0})};for(let l=0;l<t.length;l++){i.push(t[l]);let m=JSON.stringify(i,null,2);Buffer.byteLength(m)>r&&i.length>1&&(i.pop(),a(l-1),i=[t[l]],u=l)}a(u+i.length-1)}#O(t,e){return t.length===0?e||"Untitled":t.map(n=>n.text).join(" > ")}};function J(o){let t=L(o);for(;;){let e=H(t,".claude","context-mode.json");try{let r=W(e,"utf-8");return{config:JSON.parse(r),configPath:e}}catch{}let n=ht(t);if(n===t)break;t=n}return null}function mt(o,t){let e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`).test(o)}function C(o,t,e){let n=[];try{let r=ct(o);for(let s of r){let c=H(o,s);try{let i=lt(c);i.isDirectory()&&e?n.push(...C(c,t,!0)):i.isFile()&&mt(s,t)&&n.push(c)}catch{}}}catch{}return n}function w(o,t){try{let e=W(o,"utf-8");return e.trim().length===0?null:{name:t?dt(t,o):pt(o),path:o,content:e}}catch{return null}}function ft(o){if(o.paths){let t=o.path||".";return o.paths.map(e=>L(t,e)).map(e=>w(e,t)).filter(e=>e!==null)}if(o.exec){let t=o.path||process.cwd();try{let e=ut(o.exec,{cwd:t,encoding:"utf-8",timeout:1e4}).trim(),n=JSON.parse(e);return Array.isArray(n)?n.map(r=>L(t,r)).map(r=>w(r,t)).filter(r=>r!==null):(process.stderr.write(`[context-wrapper] exec for "${o.label}" did not return an array
`),[])}catch(e){return process.stderr.write(`[context-wrapper] exec for "${o.label}" failed: ${e.message}
`),[]}}return o.glob&&o.path?C(o.path,o.glob,!!o.recursive).map(t=>w(t,o.path)).filter(t=>t!==null):(process.stderr.write(`[context-wrapper] source "${o.label}" has no file selection strategy (need glob+path, exec, or paths)
`),[])}function I(o){if(!o.startsWith("---"))return o;let t=o.indexOf(`
---`,3);return t===-1?o:o.slice(t+4).replace(/^\n+/,"")}function gt(o,t){let e=t.match(/^(\d{4}-\d{2}-\d{2})\.md$/);if(!e)return o;let n=e[1],r=o.split(`
`),s=[];for(let c of r){if(/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(c))continue;let i=c.match(/^(##\s+)(.+)$/);i?s.push(`${i[1]}[${n}] ${i[2]}`):s.push(c)}return s.join(`
`)}function D(o){return o.replace(/\n{3,}/g,`

`)}function bt(o,t){let e=o.content;return t.stripFrontmatter&&(e=I(e)),t.prefixDates&&(e=gt(e,o.name)),e=D(e),e}function X(o,t){let e=new _(t),n=0,r=0;for(let s of o.sources){let c=ft(s);if(c.length!==0)for(let i of c){let u=bt(i,s);if(u.trim().length===0)continue;let a=`${s.label}: ${i.name}`,l=e.index({content:u,source:a});n++,r+=l.totalChunks}}return{totalSources:n,totalChunks:r}}var G={execute:"ctx_execute",index:"ctx_index",search:"ctx_search",fetch_and_index:"ctx_fetch_and_index",batch_execute:"ctx_batch_execute"},q=new Map(Object.entries(G).map(([o,t])=>[t,o])),At=new Set(["ctx_stats","ctx_doctor","ctx_upgrade"]),Ot={name:"index_folder",description:`Index all matching files in a directory into the searchable BM25 knowledge base. Each file becomes a separate indexed source with its own label, enabling per-file search results. Re-indexing the same folder replaces previous content (dedup by label).

Use for: documentation directories, note folders, code reference collections, any set of files you want searchable as a unit.
After indexing, use 'search' to retrieve specific sections on-demand.`,inputSchema:{type:"object",properties:{path:{type:"string",description:"Absolute or relative path to the directory to index."},glob:{type:"string",description:'Filename pattern to match (e.g. "*.md", "*.txt"). Defaults to "*.md".'},recursive:{type:"boolean",description:"Whether to walk subdirectories. Defaults to true."},source:{type:"string",description:'Label prefix for indexed content. Each file gets "{source}: {relative/path}". Defaults to the directory basename.'},stripFrontmatter:{type:"boolean",description:"Strip YAML frontmatter (---/---) from file starts before indexing. Defaults to true."}},required:["path"]}};async function Lt(){let o=V(kt(import.meta.url)),t=o.endsWith("/src")?V(o):o,e=Y(t,"node_modules","context-mode","server.bundle.mjs"),n=new _t({command:"node",args:[e],env:{...process.env},stderr:"inherit"}),r=new Tt({name:"context-wrapper",version:"0.2.0"});await r.connect(n);let s=n.pid;if(!s)throw new Error("Failed to get upstream server PID");process.stderr.write(`[context-wrapper] Connected to upstream server (pid ${s})
`);let c=J(process.cwd());if(c){let p=Y(xt(),`context-mode-${s}.db`),d=performance.now(),f=X(c.config,p),g=(performance.now()-d).toFixed(0);process.stderr.write(`[context-wrapper] Pre-warmed ${f.totalChunks} chunks from ${f.totalSources} files in ${g}ms
`)}let{tools:i}=await r.listTools(),u=i.find(p=>p.name==="ctx_execute_file"),a=i.filter(p=>!At.has(p.name)).filter(p=>p.name!=="ctx_execute_file").filter(p=>q.has(p.name)).map(p=>{let d=q.get(p.name);if(d==="execute"&&u){let f={...p.inputSchema.properties??{}};return u.inputSchema.properties?.path?f.path=u.inputSchema.properties.path:f.path={type:"string",description:"Absolute file path or relative to project root. When provided, reads this file into a FILE_CONTENT variable inside the sandbox \u2014 file contents stay in sandbox, only your printed output enters context."},{...p,name:d,description:(p.description??"")+"\n\nWhen `path` is provided, reads the file at that path into a FILE_CONTENT variable inside the sandbox. The full file contents do NOT enter context \u2014 only what you print. Use instead of Read/cat for log files, data files, large source files, or any file where you need to extract specific information rather than read the entire content.",inputSchema:{...p.inputSchema,properties:f}}}return{...p,name:d}});a.push(Ot);let l=new wt({name:"context-wrapper",version:"0.2.0"},{capabilities:{tools:{}}});l.setRequestHandler(Ct,async()=>({tools:a})),l.setRequestHandler(Nt,async p=>{let{name:d,arguments:f}=p.params;if(d==="index_folder"){let b=St(String(f?.path??"")),x=String(f?.glob??"*.md"),S=f?.recursive!==!1,k=f?.stripFrontmatter!==!1,N=String(f?.source??yt(b)),$=!1;try{$=Et(b).isDirectory()}catch{}if(!$)return{content:[{type:"text",text:`Error: "${b}" is not a directory.`}],isError:!0};let v=C(b,x,S);if(v.length===0)return{content:[{type:"text",text:`No files matching "${x}" found in ${b}.`}]};let A=0,F=0,R=[];for(let K of v){let T=w(K,b);if(!T)continue;let E=T.content;if(k&&(E=I(E)),E=D(E),E.trim().length===0)continue;let Q=`${N}: ${T.name}`;try{let M=((await r.callTool({name:"ctx_index",arguments:{content:E,source:Q}}))?.content?.[0]?.text??"").match(/^Indexed (\d+) sections/);M&&(F+=parseInt(M[1],10)),A++}catch(P){R.push(`${T.name}: ${P.message}`)}}return{content:[{type:"text",text:`Indexed ${A} file${A!==1?"s":""} (${F} chunks) from ${b}`+(R.length>0?`

Errors (${R.length}):
${R.join(`
`)}`:"")}]}}let g;if(d==="execute"&&f?.path!==void 0?g="ctx_execute_file":g=G[d],!g)return{content:[{type:"text",text:`Unknown tool: ${d}`}],isError:!0};let y=await r.callTool({name:g,arguments:f});if(d==="search"&&c?.config.searchReminder!==void 0){let b=c.config.searchReminder,x=y.content;if(Array.isArray(x))for(let S of x){if(S.type!=="text"||typeof S.text!="string")continue;let k=/\n\n⚠ search call #\d+\/\d+ in this window\..+$/s,N=/^BLOCKED: \d+ search calls in \d+s\..+$/s;k.test(S.text)?S.text=b===!1?S.text.replace(k,""):S.text.replace(k,`

${b}`):N.test(S.text)&&(S.text=b===!1?"":String(b))}}return y});let m=new Rt;await l.connect(m),process.stderr.write(`[context-wrapper] MCP server ready (${a.length} tools)
`);let h=async()=>{await Promise.allSettled([r.close(),l.close()])};process.stdin.on("end",()=>process.exit(0)),process.on("SIGINT",async()=>{await h(),process.exit(0)}),process.on("SIGTERM",async()=>{await h(),process.exit(0)}),process.on("exit",()=>{try{process.kill(s)}catch{}})}Lt().catch(o=>{process.stderr.write(`[context-wrapper] Fatal: ${o.message}
${o.stack}
`),process.exit(1)});
