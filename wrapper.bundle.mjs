import{join as I}from"node:path";import{tmpdir as et}from"node:os";import{Server as nt}from"@modelcontextprotocol/sdk/server/index.js";import{StdioServerTransport as rt}from"@modelcontextprotocol/sdk/server/stdio.js";import{Client as st}from"@modelcontextprotocol/sdk/client/index.js";import{StdioClientTransport as ot}from"@modelcontextprotocol/sdk/client/stdio.js";import{ListToolsRequestSchema as it,CallToolRequestSchema as at}from"@modelcontextprotocol/sdk/types.js";import{readFileSync as C,readdirSync as H,statSync as J}from"node:fs";import{execSync as X}from"node:child_process";import{join as N,dirname as V,basename as Y,resolve as T}from"node:path";import{createRequire as v}from"node:module";var E=null;function w(){return E||(E=v(import.meta.url)("better-sqlite3")),E}function R(o){o.pragma("journal_mode = WAL"),o.pragma("synchronous = NORMAL")}import{readFileSync as $,readdirSync as mt,unlinkSync as M}from"node:fs";import{tmpdir as P}from"node:os";import{join as j}from"node:path";var x=new Set(["the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","has","his","how","its","may","new","now","old","see","way","who","did","get","got","let","say","she","too","use","will","with","this","that","from","they","been","have","many","some","them","than","each","make","like","just","over","such","take","into","year","your","good","could","would","about","which","their","there","other","after","should","through","also","more","most","only","very","when","what","then","these","those","being","does","done","both","same","still","while","where","here","were","much","update","updates","updated","deps","dev","tests","test","add","added","fix","fixed","run","running","using"]);function z(o,t="AND"){let e=o.replace(/['"(){}[\]*:^~]/g," ").split(/\s+/).filter(n=>n.length>0&&!["AND","OR","NOT","NEAR"].includes(n.toUpperCase()));return e.length===0?'""':e.map(n=>`"${n}"`).join(t==="OR"?" OR ":" ")}function U(o,t="AND"){let e=o.replace(/["'(){}[\]*:^~]/g,"").trim();if(e.length<3)return"";let n=e.split(/\s+/).filter(r=>r.length>=3);return n.length===0?"":n.map(r=>`"${r}"`).join(t==="OR"?" OR ":" ")}function B(o,t){if(o.length===0)return t.length;if(t.length===0)return o.length;let e=Array.from({length:t.length+1},(n,r)=>r);for(let n=1;n<=o.length;n++){let r=[n];for(let s=1;s<=t.length;s++)r[s]=o[n-1]===t[s-1]?e[s-1]:1+Math.min(e[s],r[s-1],e[s-1]);e=r}return e[t.length]}function W(o){return o<=4?1:o<=12?2:3}var _=4096;var y=class{#t;#n;#r;#s;#o;#i;#a;#c;#u;#l;#h;#p;#d;#m;#g;#f;#b;#y;#S;#E;constructor(t){let e=w();this.#n=t??j(P(),`context-mode-${process.pid}.db`),this.#t=new e(this.#n,{timeout:5e3}),R(this.#t),this.#T(),this.#w()}cleanup(){try{this.#t.close()}catch{}for(let t of["","-wal","-shm"])try{M(this.#n+t)}catch{}}#T(){this.#t.exec(`
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
    `)}#w(){this.#r=this.#t.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count) VALUES (?, 0, 0)"),this.#s=this.#t.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count) VALUES (?, ?, ?)"),this.#o=this.#t.prepare("INSERT INTO chunks (title, content, source_id, content_type) VALUES (?, ?, ?, ?)"),this.#i=this.#t.prepare("INSERT INTO chunks_trigram (title, content, source_id, content_type) VALUES (?, ?, ?, ?)"),this.#a=this.#t.prepare("INSERT OR IGNORE INTO vocabulary (word) VALUES (?)"),this.#c=this.#t.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#u=this.#t.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#l=this.#t.prepare("DELETE FROM sources WHERE label = ?"),this.#h=this.#t.prepare(`
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
    `)}index(t){let{content:e,path:n,source:r}=t;if(!e&&!n)throw new Error("Either content or path must be provided");let s=e??$(n,"utf-8"),a=r??n??"untitled",i=this.#x(s);return this.#e(i,a,s)}indexPlainText(t,e,n=20){if(!t||t.trim().length===0)return this.#e([],e,"");let r=this.#_(t,n);return this.#e(r.map(s=>({...s,hasCode:!1})),e,t)}indexJSON(t,e,n=_){if(!t||t.trim().length===0)return this.indexPlainText("",e);let r;try{r=JSON.parse(t)}catch{return this.indexPlainText(t,e)}let s=[];return this.#k(r,[],s,n),s.length===0?this.indexPlainText(t,e):this.#e(s,e,t)}#e(t,e,n){let r=t.filter(i=>i.hasCode).length,a=this.#t.transaction(()=>{if(this.#c.run(e),this.#u.run(e),this.#l.run(e),t.length===0){let c=this.#r.run(e);return Number(c.lastInsertRowid)}let i=this.#s.run(e,t.length,r),l=Number(i.lastInsertRowid);for(let c of t){let u=c.hasCode?"code":"prose";this.#o.run(c.title,c.content,l,u),this.#i.run(c.title,c.content,l,u)}return l})();return n&&this.#R(n),{sourceId:a,label:e,totalChunks:t.length,codeChunks:r}}search(t,e=3,n,r="AND"){let s=z(t,r),a=n?this.#p:this.#h,i=n?[s,`%${n}%`,e]:[s,e];return a.all(...i).map(c=>({title:c.title,content:c.content,source:c.label,rank:c.rank,contentType:c.content_type,highlighted:c.highlighted}))}searchTrigram(t,e=3,n,r="AND"){let s=U(t,r);if(!s)return[];let a=n?this.#m:this.#d,i=n?[s,`%${n}%`,e]:[s,e];return a.all(...i).map(c=>({title:c.title,content:c.content,source:c.label,rank:c.rank,contentType:c.content_type,highlighted:c.highlighted}))}fuzzyCorrect(t){let e=t.toLowerCase().trim();if(e.length<3)return null;let n=W(e.length),r=this.#g.all(e.length-n,e.length+n),s=null,a=n+1;for(let{word:i}of r){if(i===e)return null;let l=B(e,i);l<a&&(a=l,s=i)}return a<=n?s:null}searchWithFallback(t,e=3,n){let r=this.search(t,e,n,"AND");if(r.length>0)return r.map(p=>({...p,matchLayer:"porter"}));let s=this.search(t,e,n,"OR");if(s.length>0)return s.map(p=>({...p,matchLayer:"porter"}));let a=this.searchTrigram(t,e,n,"AND");if(a.length>0)return a.map(p=>({...p,matchLayer:"trigram"}));let i=this.searchTrigram(t,e,n,"OR");if(i.length>0)return i.map(p=>({...p,matchLayer:"trigram"}));let l=t.toLowerCase().trim().split(/\s+/).filter(p=>p.length>=3),c=l.join(" "),h=l.map(p=>this.fuzzyCorrect(p)??p).join(" ");if(h!==c){let p=this.search(h,e,n,"AND");if(p.length>0)return p.map(g=>({...g,matchLayer:"fuzzy"}));let m=this.search(h,e,n,"OR");if(m.length>0)return m.map(g=>({...g,matchLayer:"fuzzy"}));let d=this.searchTrigram(h,e,n,"AND");if(d.length>0)return d.map(g=>({...g,matchLayer:"fuzzy"}));let f=this.searchTrigram(h,e,n,"OR");if(f.length>0)return f.map(g=>({...g,matchLayer:"fuzzy"}))}return[]}listSources(){return this.#f.all()}getChunksBySource(t){return this.#b.all(t).map(n=>({title:n.title,content:n.content,source:n.label,rank:0,contentType:n.content_type}))}getDistinctiveTerms(t,e=40){let n=this.#y.get(t);if(!n||n.chunk_count<3)return[];let r=n.chunk_count,s=2,a=Math.max(3,Math.ceil(r*.4)),i=new Map;for(let u of this.#S.iterate(t)){let h=new Set(u.content.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(p=>p.length>=3&&!x.has(p)));for(let p of h)i.set(p,(i.get(p)??0)+1)}return Array.from(i.entries()).filter(([,u])=>u>=s&&u<=a).map(([u,h])=>{let p=Math.log(r/h),m=Math.min(u.length/20,.5),d=/[_]/.test(u),f=u.length>=12,g=d?1.5:f?.8:0;return{word:u,score:p+m+g}}).sort((u,h)=>h.score-u.score).slice(0,e).map(u=>u.word)}getStats(){let t=this.#E.get();return{sources:t?.sources??0,chunks:t?.chunks??0,codeChunks:t?.codeChunks??0}}close(){this.#t.close()}#R(t){let e=t.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(r=>r.length>=3&&!x.has(r)),n=[...new Set(e)];this.#t.transaction(()=>{for(let r of n)this.#a.run(r)})()}#x(t,e=_){let n=[],r=t.split(`
`),s=[],a=[],i="",l=()=>{let u=a.join(`
`).trim();if(u.length===0)return;let h=this.#A(s,i),p=a.some(b=>/^`{3,}/.test(b));if(Buffer.byteLength(u)<=e){n.push({title:h,content:u,hasCode:p}),a=[];return}let m=u.split(/\n\n+/),d=[],f=1,g=()=>{if(d.length===0)return;let b=d.join(`

`).trim();if(b.length===0)return;let S=m.length>1?`${h} (${f})`:h;f++,n.push({title:S,content:b,hasCode:b.includes("```")}),d=[]};for(let b of m){d.push(b);let S=d.join(`

`);Buffer.byteLength(S)>e&&d.length>1&&(d.pop(),g(),d=[b])}g(),a=[]},c=0;for(;c<r.length;){let u=r[c];if(/^[-_*]{3,}\s*$/.test(u)){l(),c++;continue}let h=u.match(/^(#{1,4})\s+(.+)$/);if(h){l();let m=h[1].length,d=h[2].trim();for(;s.length>0&&s[s.length-1].level>=m;)s.pop();s.push({level:m,text:d}),i=d,a.push(u),c++;continue}let p=u.match(/^(`{3,})(.*)?$/);if(p){let m=p[1],d=[u];for(c++;c<r.length;){if(d.push(r[c]),r[c].startsWith(m)&&r[c].trim()===m){c++;break}c++}a.push(...d);continue}a.push(u),c++}return l(),n}#_(t,e){let n=t.split(/\n\s*\n/);if(n.length>=3&&n.length<=200&&n.every(l=>Buffer.byteLength(l)<5e3))return n.map((l,c)=>{let u=l.trim();return{title:u.split(`
`)[0].slice(0,80)||`Section ${c+1}`,content:u}}).filter(l=>l.content.length>0);let r=t.split(`
`);if(r.length<=e)return[{title:"Output",content:t}];let s=[],i=Math.max(e-2,1);for(let l=0;l<r.length;l+=i){let c=r.slice(l,l+e);if(c.length===0)break;let u=l+1,h=Math.min(l+c.length,r.length),p=c[0]?.trim().slice(0,80);s.push({title:p||`Lines ${u}-${h}`,content:c.join(`
`)})}return s}#k(t,e,n,r){let s=e.length>0?e.join(" > "):"(root)",a=JSON.stringify(t,null,2);if(Buffer.byteLength(a)<=r&&!(typeof t=="object"&&t!==null&&!Array.isArray(t)&&Object.values(t).some(l=>typeof l=="object"&&l!==null))){n.push({title:s,content:a,hasCode:!0});return}if(typeof t=="object"&&t!==null&&!Array.isArray(t)){let i=Object.entries(t);if(i.length>0){for(let[l,c]of i)this.#k(c,[...e,l],n,r);return}n.push({title:s,content:a,hasCode:!0});return}if(Array.isArray(t)){this.#O(t,e,n,r);return}n.push({title:s,content:a,hasCode:!1})}#C(t){if(t.length===0)return null;let e=t[0];if(typeof e!="object"||e===null||Array.isArray(e))return null;let n=["id","name","title","path","slug","key","label"],r=e;for(let s of n)if(s in r&&(typeof r[s]=="string"||typeof r[s]=="number"))return s;return null}#N(t,e,n,r,s){let a=t?`${t} > `:"";if(!s)return e===n?`${a}[${e}]`:`${a}[${e}-${n}]`;let i=l=>String(l[s]);return r.length===1?`${a}${i(r[0])}`:r.length<=3?a+r.map(i).join(", "):`${a}${i(r[0])}\u2026${i(r[r.length-1])}`}#O(t,e,n,r){let s=e.length>0?e.join(" > "):"(root)",a=this.#C(t),i=[],l=0,c=u=>{if(i.length===0)return;let h=this.#N(s,l,u,i,a);n.push({title:h,content:JSON.stringify(i,null,2),hasCode:!0})};for(let u=0;u<t.length;u++){i.push(t[u]);let h=JSON.stringify(i,null,2);Buffer.byteLength(h)>r&&i.length>1&&(i.pop(),c(u-1),i=[t[u]],l=u)}c(l+i.length-1)}#A(t,e){return t.length===0?e||"Untitled":t.map(n=>n.text).join(" > ")}};function O(o){let t=T(o);for(;;){let e=N(t,".claude","context-mode.json");try{let r=C(e,"utf-8");return{config:JSON.parse(r),configPath:e}}catch{}let n=V(t);if(n===t)break;t=n}return null}function q(o,t){let e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`).test(o)}function A(o,t,e){let n=[];try{let r=H(o);for(let s of r){let a=N(o,s);try{let i=J(a);i.isDirectory()&&e?n.push(...A(a,t,!0)):i.isFile()&&q(s,t)&&n.push(a)}catch{}}}catch{}return n}function k(o){try{let t=C(o,"utf-8");return t.trim().length===0?null:{name:Y(o),path:o,content:t}}catch{return null}}function G(o){if(o.paths){let t=o.path||".";return o.paths.map(e=>T(t,e)).map(k).filter(e=>e!==null)}if(o.exec){let t=o.path||process.cwd();try{let e=X(o.exec,{cwd:t,encoding:"utf-8",timeout:1e4}).trim(),n=JSON.parse(e);return Array.isArray(n)?n.map(r=>T(t,r)).map(k).filter(r=>r!==null):(process.stderr.write(`[context-wrapper] exec for "${o.label}" did not return an array
`),[])}catch(e){return process.stderr.write(`[context-wrapper] exec for "${o.label}" failed: ${e.message}
`),[]}}return o.glob&&o.path?A(o.path,o.glob,!!o.recursive).map(k).filter(t=>t!==null):(process.stderr.write(`[context-wrapper] source "${o.label}" has no file selection strategy (need glob+path, exec, or paths)
`),[])}function K(o){if(!o.startsWith("---"))return o;let t=o.indexOf(`
---`,3);return t===-1?o:o.slice(t+4).replace(/^\n+/,"")}function Q(o,t){let e=t.match(/^(\d{4}-\d{2}-\d{2})\.md$/);if(!e)return o;let n=e[1],r=o.split(`
`),s=[];for(let a of r){if(/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(a))continue;let i=a.match(/^(##\s+)(.+)$/);i?s.push(`${i[1]}[${n}] ${i[2]}`):s.push(a)}return s.join(`
`)}function Z(o){return o.replace(/\n{3,}/g,`

`)}function tt(o,t){let e=o.content;return t.stripFrontmatter&&(e=K(e)),t.prefixDates&&(e=Q(e,o.name)),e=Z(e),e}function L(o,t){let e=new y(t),n=0,r=0;for(let s of o.sources){let a=G(s);if(a.length!==0)for(let i of a){let l=tt(i,s),c=`${s.label}: ${i.name}`,u=e.index({content:l,source:c});n++,r+=u.totalChunks}}return{totalSources:n,totalChunks:r}}var F={execute:"ctx_execute",index:"ctx_index",search:"ctx_search",fetch_and_index:"ctx_fetch_and_index",batch_execute:"ctx_batch_execute"},D=new Map(Object.entries(F).map(([o,t])=>[t,o])),ct=new Set(["ctx_stats","ctx_doctor","ctx_upgrade"]);async function ut(){let o=I(process.cwd(),"node_modules","context-mode","server.bundle.mjs"),t=new ot({command:"node",args:[o],env:{...process.env},stderr:"inherit"}),e=new st({name:"context-wrapper",version:"0.1.0"});await e.connect(t);let n=t.pid;if(!n)throw new Error("Failed to get upstream server PID");process.stderr.write(`[context-wrapper] Connected to upstream server (pid ${n})
`);let r=O(process.cwd());if(r){let h=I(et(),`context-mode-${n}.db`),p=performance.now(),m=L(r.config,h),d=(performance.now()-p).toFixed(0);process.stderr.write(`[context-wrapper] Pre-warmed ${m.totalChunks} chunks from ${m.totalSources} files in ${d}ms
`)}let{tools:s}=await e.listTools(),a=s.find(h=>h.name==="ctx_execute_file"),i=s.filter(h=>!ct.has(h.name)).filter(h=>h.name!=="ctx_execute_file").filter(h=>D.has(h.name)).map(h=>{let p=D.get(h.name);if(p==="execute"&&a){let m={...h.inputSchema.properties??{}};return a.inputSchema.properties?.path?m.path=a.inputSchema.properties.path:m.path={type:"string",description:"Absolute file path or relative to project root. When provided, reads this file into a FILE_CONTENT variable inside the sandbox \u2014 file contents stay in sandbox, only your printed output enters context."},{...h,name:p,description:(h.description??"")+"\n\nWhen `path` is provided, reads the file at that path into a FILE_CONTENT variable inside the sandbox. The full file contents do NOT enter context \u2014 only what you print. Use instead of Read/cat for log files, data files, large source files, or any file where you need to extract specific information rather than read the entire content.",inputSchema:{...h.inputSchema,properties:m}}}return{...h,name:p}}),l=new nt({name:"context-wrapper",version:"0.1.0"},{capabilities:{tools:{}}});l.setRequestHandler(it,async()=>({tools:i})),l.setRequestHandler(at,async h=>{let{name:p,arguments:m}=h.params,d;return p==="execute"&&m?.path!==void 0?d="ctx_execute_file":d=F[p],d?await e.callTool({name:d,arguments:m}):{content:[{type:"text",text:`Unknown tool: ${p}`}],isError:!0}});let c=new rt;await l.connect(c),process.stderr.write(`[context-wrapper] MCP server ready (${i.length} tools)
`);let u=()=>{e.close().catch(()=>{}),l.close().catch(()=>{})};process.on("SIGINT",()=>{u(),process.exit(0)}),process.on("SIGTERM",()=>{u(),process.exit(0)}),process.on("exit",u)}ut().catch(o=>{process.stderr.write(`[context-wrapper] Fatal: ${o.message}
${o.stack}
`),process.exit(1)});
