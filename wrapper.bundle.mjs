import{join as Le,dirname as we,resolve as q}from"node:path";import{tmpdir as Dt}from"node:os";import{mkdtempSync as vt,readFileSync as Nt,rmSync as Ct}from"node:fs";import{randomBytes as Lt}from"node:crypto";import{fileURLToPath as wt}from"node:url";import{Server as Ot}from"@modelcontextprotocol/sdk/server/index.js";import{StdioServerTransport as At}from"@modelcontextprotocol/sdk/server/stdio.js";import{Client as It}from"@modelcontextprotocol/sdk/client/index.js";import{StdioClientTransport as Ft}from"@modelcontextprotocol/sdk/client/stdio.js";import{ListToolsRequestSchema as Mt,CallToolRequestSchema as Pt}from"@modelcontextprotocol/sdk/types.js";import{readFileSync as Se,readdirSync as gt,statSync as ye,mkdirSync as pt}from"node:fs";import{execSync as mt}from"node:child_process";import{join as V,dirname as ft,basename as be,resolve as P,relative as Et}from"node:path";import{createRequire as Fe}from"node:module";import{existsSync as Me,unlinkSync as K,renameSync as Yt}from"node:fs";var B=class{#e;constructor(e){this.#e=e}pragma(e){let n=this.#e.prepare(`PRAGMA ${e}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let r=Object.values(n[0]);return r.length===1?r[0]:n[0]}exec(e){let t="",n=null;for(let o=0;o<e.length;o++){let i=e[o];if(n)t+=i,i===n&&(n=null);else if(i==="'"||i==='"')t+=i,n=i;else if(i===";"){let a=t.trim();a&&this.#e.prepare(a).run(),t=""}else t+=i}let r=t.trim();return r&&this.#e.prepare(r).run(),this}prepare(e){let t=this.#e.prepare(e);return{run:(...n)=>t.run(...n),get:(...n)=>{let r=t.get(...n);return r===null?void 0:r},all:(...n)=>t.all(...n),iterate:(...n)=>t.iterate(...n)}}transaction(e){return this.#e.transaction(e)}close(){this.#e.close()}},j=class{#e;constructor(e){this.#e=e}pragma(e){let n=this.#e.prepare(`PRAGMA ${e}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let r=Object.values(n[0]);return r.length===1?r[0]:n[0]}exec(e){return this.#e.exec(e),this}prepare(e){let t=this.#e.prepare(e);return{run:(...n)=>t.run(...n),get:(...n)=>t.get(...n),all:(...n)=>t.all(...n),iterate:(...n)=>typeof t.iterate=="function"?t.iterate(...n):t.all(...n)[Symbol.iterator]()}}transaction(e){return(...t)=>{this.#e.exec("BEGIN");try{let n=e(...t);return this.#e.exec("COMMIT"),n}catch(n){throw this.#e.exec("ROLLBACK"),n}}}close(){this.#e.close()}},w=null;function Pe(s){let e=null;try{return e=new s(":memory:"),e.exec("CREATE VIRTUAL TABLE __fts5_probe USING fts5(x)"),!0}catch{return!1}finally{try{e?.close()}catch{}}}function Ue(s,e){let t=e!==void 0?e:globalThis.Bun;if(typeof t<"u"&&t!==null)return!0;let n=s??process.versions,[r,o]=(n.node??"0.0.0").split("."),i=Number(r),a=Number(o);return!Number.isFinite(i)||!Number.isFinite(a)?!1:i>22||i===22&&a>=5}function J(){if(!w){let s=Fe(import.meta.url);if(globalThis.Bun){let e=s(["bun","sqlite"].join(":")).Database;w=function(n,r){let o=new e(n,{readonly:r?.readonly,create:!0}),i=new B(o);return r?.timeout&&i.pragma(`busy_timeout = ${r.timeout}`),i}}else if(Ue()){let e=null;try{({DatabaseSync:e}=s(["node","sqlite"].join(":")))}catch{e=null}e&&Pe(e)?w=function(n,r){let o=new e(n,{readOnly:r?.readonly??!1}),i=new j(o);return r?.timeout&&i.pragma(`busy_timeout = ${r.timeout}`),i}:w=s("better-sqlite3")}else w=s("better-sqlite3")}return w}function H(s){s.pragma("journal_mode = WAL"),s.pragma("synchronous = NORMAL");try{s.pragma("mmap_size = 268435456")}catch{}}function W(s){if(!Me(s))for(let e of["-wal","-shm"])try{K(s+e)}catch{}}function Q(s){for(let e of["","-wal","-shm"])try{K(s+e)}catch{}}function X(s){try{s.pragma("wal_checkpoint(TRUNCATE)")}catch{}try{s.close()}catch{}}function O(s,e=[100,500,2e3]){let t;for(let n=0;n<=e.length;n++)try{return s()}catch(r){let o=r instanceof Error?r.message:String(r);if(!o.includes("SQLITE_BUSY")&&!o.includes("database is locked"))throw r;if(t=r instanceof Error?r:new Error(o),n<e.length){let i=e[n],a=Date.now();for(;Date.now()-a<i;);}}throw new Error(`SQLITE_BUSY: database is locked after ${e.length} retries. Original error: ${t?.message}`)}function Z(s){return s.includes("SQLITE_CORRUPT")||s.includes("SQLITE_NOTADB")||s.includes("database disk image is malformed")||s.includes("file is not a database")}var F=Symbol.for("__context_mode_live_dbs_v3__"),qt=(()=>{let s=globalThis;return s[F]||(s[F]=new Set,process.on("exit",()=>{for(let e of s[F])X(e);s[F].clear()})),s[F]})();import{readFileSync as ie,readdirSync as en,unlinkSync as et,existsSync as tt,statSync as oe,openSync as ae,fstatSync as ce,closeSync as ue}from"node:fs";import{createHash as le}from"node:crypto";import{tmpdir as nt}from"node:os";import{join as rt}from"node:path";import{readdirSync as $e,statSync as Be,lstatSync as je,realpathSync as ee,existsSync as He,readFileSync as We}from"node:fs";import{join as ne,extname as Xe,relative as re,sep as Ve,resolve as Ye}from"node:path";var qe=["node_modules",".git","dist","build",".next","coverage",".venv","__pycache__",".DS_Store"],Ge=[".md",".mdx",".txt",".json",".yaml",".yml",".ts",".tsx",".js",".jsx",".py",".rs",".go",".sh"],ze=5,Ke=200;function Je(s){let e="";for(let t=0;t<s.length;t++){let n=s[t];n==="*"?s[t+1]==="*"?(e+=".*",t++):e+="[^/]*":n==="?"?e+="[^/]":"\\^$.|+()[]{}".includes(n)?e+="\\"+n:e+=n}return new RegExp(`^${e}$`)}function te(s,e){if(e.length===0)return!1;let t=s.split("/").pop()??s;for(let n of e){if(!n.includes("/")&&!n.includes("*")){if(t===n||s.split("/").includes(n))return!0;continue}let r=Je(n);if(r.test(s)||r.test(t))return!0}return!1}function Qe(s){let e=ne(s,".gitignore");if(!He(e))return[];try{return We(e,"utf-8").split(/\r?\n/).map(n=>n.trim()).filter(n=>n.length>0&&!n.startsWith("#")&&!n.startsWith("!")).map(n=>n.replace(/^\//,"").replace(/\/$/,""))}catch{return[]}}function Ze(s,e){return re(s,e).split(Ve).join("/")}function se(s,e={}){let{include:t,exclude:n,maxDepth:r=ze,maxFiles:o=Ke,extensions:i,respectGitignore:a=!0,followSymlinks:c=!1}=e,u;try{u=ee(s)}catch{return{files:[],capped:!1,totalSeen:0}}let l=(i&&i.length>0?i:Ge).map(f=>(f.startsWith(".")?f:"."+f).toLowerCase()),h=[...qe,...n??[],...a?Qe(u):[]],d=t??[],g=[],p=new Set([u]),E=0,m=!1;function _(f,T){if(m||T>r)return;let L;try{L=$e(f,{withFileTypes:!0})}catch{return}for(let R of L){if(m)return;let S=ne(f,R.name),x=Ze(u,S);if(te(x,h))continue;let k=R.isDirectory(),D=R.isFile(),b=!1;try{b=je(S).isSymbolicLink()}catch{continue}if(b){if(!c)continue;let y;try{y=ee(S)}catch{continue}let C=re(u,y);if((C.startsWith("..")||Ye(C)===y)&&C.startsWith("..")||p.has(y))continue;p.add(y);try{let v=Be(y);k=v.isDirectory(),D=v.isFile()}catch{continue}}if(k){_(S,T+1);continue}if(!D)continue;let I=Xe(S).toLowerCase();if(l.includes(I)&&!(d.length>0&&!te(x,d))){if(E++,g.length>=o){m=!0;return}g.push(S)}}}return _(u,0),{files:g,capped:m,totalSeen:E}}var A=new Set(["the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","has","his","how","its","may","new","now","old","see","way","who","did","get","got","let","say","she","too","use","will","with","this","that","from","they","been","have","many","some","them","than","each","make","like","just","over","such","take","into","year","your","good","could","would","about","which","their","there","other","after","should","through","also","more","most","only","very","when","what","then","these","those","being","does","done","both","same","still","while","where","here","were","much","update","updates","updated","deps","dev","tests","test","add","added","fix","fixed","run","running","using"]);function he(s){let e=new Set,t=[];for(let n of s){let r=n.toLowerCase();e.has(r)||(e.add(r),t.push(n))}return t}function st(s,e="AND"){let t=he(s.replace(/['"(){}[\]*:^~]/g," ").split(/\s+/).filter(o=>o.length>0&&!["AND","OR","NOT","NEAR"].includes(o.toUpperCase())));if(t.length===0)return'""';let n=t.filter(o=>!A.has(o.toLowerCase()));return(n.length>0?n:t).map(o=>`"${o}"`).join(e==="OR"?" OR ":" ")}function it(s,e="AND"){let t=s.replace(/["'(){}[\]*:^~]/g,"").trim();if(t.length<3)return"";let n=he(t.split(/\s+/).filter(i=>i.length>=3));if(n.length===0)return"";let r=n.filter(i=>!A.has(i.toLowerCase()));return(r.length>0?r:n).map(i=>`"${i}"`).join(e==="OR"?" OR ":" ")}function ot(s,e){if(s.length===0)return e.length;if(e.length===0)return s.length;let t=Array.from({length:e.length+1},(n,r)=>r);for(let n=1;n<=s.length;n++){let r=[n];for(let o=1;o<=e.length;o++)r[o]=s[n-1]===e[o-1]?t[o-1]:1+Math.min(t[o],r[o-1],t[o-1]);t=r}return t[e.length]}function at(s){return s<=4?1:s<=12?2:3}var de=4096;function ct(s,e){let t=[],n=s.indexOf(e);for(;n!==-1;)t.push(n),n=s.indexOf(e,n+1);return t}function ut(s,e,t=30){if(s.length<2||e.length<2)return 0;let n=0,r=Math.min(s.length,e.length)-1;for(let o=0;o<r;o++){let i=s[o],a=s[o+1],c=e[o].length,u=0;for(let l of i){let h=l+c,d=h+t;for(;u<a.length&&a[u]<h;)u++;u<a.length&&a[u]<=d&&(n++,u++)}}return n}function lt(s){if(s.length===0)return 1/0;if(s.length===1)return 0;let e=s,t=new Array(e.length).fill(0),n=1/0;for(;;){let r=1/0,o=-1/0,i=0;for(let c=0;c<e.length;c++){let u=e[c][t[c]];u<r&&(r=u,i=c),u>o&&(o=u)}let a=o-r;if(a<n&&(n=a),t[i]++,t[i]>=e[i].length)break}return n}var U=class s{#e;#n;#i;#o;#a;#c;#u;#l;#d;#h;#g;#p;#m;#f;#E;#_;#S;#y;#b;#T;#R;#x;#k;#D;#v;#N;#C;#L;#w;#O;#A;#I;#F;#M=0;static OPTIMIZE_EVERY=50;#t=new Map;static FUZZY_CACHE_SIZE=256;constructor(e){let t=J();this.#n=e??rt(nt(),`context-mode-${process.pid}.db`),W(this.#n);let n;try{n=new t(this.#n,{timeout:3e4}),H(n)}catch(r){let o=r instanceof Error?r.message:String(r);if(Z(o)){Q(this.#n),W(this.#n);try{n=new t(this.#n,{timeout:3e4}),H(n)}catch(i){throw new Error(`Failed to create fresh DB after deleting corrupt file: ${i instanceof Error?i.message:String(i)}`)}}else throw r}this.#e=n,this.#H(),this.#W()}cleanup(){try{this.#e.close()}catch{}for(let e of["","-wal","-shm"])try{et(this.#n+e)}catch{}}#H(){this.#e.exec(`
      CREATE TABLE IF NOT EXISTS sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        chunk_count INTEGER NOT NULL DEFAULT 0,
        code_chunk_count INTEGER NOT NULL DEFAULT 0,
        indexed_at TEXT NOT NULL DEFAULT (datetime('now')),
        file_path TEXT,
        content_hash TEXT
      );

      CREATE VIRTUAL TABLE IF NOT EXISTS chunks USING fts5(
        title,
        content,
        source_id UNINDEXED,
        content_type UNINDEXED,
        source_category UNINDEXED,
        session_id UNINDEXED,
        event_id UNINDEXED,
        timestamp UNINDEXED,
        tokenize='porter unicode61'
      );

      CREATE VIRTUAL TABLE IF NOT EXISTS chunks_trigram USING fts5(
        title,
        content,
        source_id UNINDEXED,
        content_type UNINDEXED,
        source_category UNINDEXED,
        session_id UNINDEXED,
        event_id UNINDEXED,
        timestamp UNINDEXED,
        tokenize='trigram'
      );

      CREATE TABLE IF NOT EXISTS vocabulary (
        word TEXT PRIMARY KEY
      );

      CREATE INDEX IF NOT EXISTS idx_sources_label ON sources(label);
    `);try{let e=this.#e.prepare("SELECT name FROM pragma_table_xinfo('chunks')").all(),t=new Set(e.map(n=>n.name));e.length>0&&!t.has("source_category")&&(this.#e.exec("DROP TABLE IF EXISTS chunks"),this.#e.exec("DROP TABLE IF EXISTS chunks_trigram"),this.#e.exec(`
          CREATE VIRTUAL TABLE chunks USING fts5(
            title,
            content,
            source_id UNINDEXED,
            content_type UNINDEXED,
            source_category UNINDEXED,
            session_id UNINDEXED,
            event_id UNINDEXED,
            timestamp UNINDEXED,
            tokenize='porter unicode61'
          );
          CREATE VIRTUAL TABLE chunks_trigram USING fts5(
            title,
            content,
            source_id UNINDEXED,
            content_type UNINDEXED,
            source_category UNINDEXED,
            session_id UNINDEXED,
            event_id UNINDEXED,
            timestamp UNINDEXED,
            tokenize='trigram'
          );
        `))}catch{}try{this.#e.exec("ALTER TABLE sources ADD COLUMN file_path TEXT")}catch{}try{this.#e.exec("ALTER TABLE sources ADD COLUMN content_hash TEXT")}catch{}}#W(){this.#o=this.#e.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count, file_path, content_hash) VALUES (?, 0, 0, ?, ?)"),this.#a=this.#e.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count, file_path, content_hash) VALUES (?, ?, ?, ?, ?)"),this.#c=this.#e.prepare("INSERT INTO chunks (title, content, source_id, content_type, source_category, session_id, event_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"),this.#u=this.#e.prepare("INSERT INTO chunks_trigram (title, content, source_id, content_type, source_category, session_id, event_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"),this.#l=this.#e.prepare("INSERT OR IGNORE INTO vocabulary (word) VALUES (?)"),this.#d=this.#e.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#h=this.#e.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#g=this.#e.prepare("DELETE FROM sources WHERE label = ?"),this.#p=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ?
      ORDER BY rank
      LIMIT ?
    `),this.#m=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label LIKE ? ESCAPE '\\'
      ORDER BY rank
      LIMIT ?
    `),this.#f=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label = ?
      ORDER BY rank
      LIMIT ?
    `),this.#E=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ?
      ORDER BY rank
      LIMIT ?
    `),this.#_=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label LIKE ? ESCAPE '\\'
      ORDER BY rank
      LIMIT ?
    `),this.#S=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label = ?
      ORDER BY rank
      LIMIT ?
    `),this.#b=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND chunks.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#T=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label LIKE ? ESCAPE '\\' AND chunks.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#R=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label = ? AND chunks.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#x=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND chunks_trigram.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#k=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label LIKE ? ESCAPE '\\' AND chunks_trigram.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#D=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label = ? AND chunks_trigram.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#y=this.#e.prepare("SELECT word FROM vocabulary WHERE length(word) BETWEEN ? AND ?"),this.#v=this.#e.prepare("SELECT label, chunk_count as chunkCount FROM sources ORDER BY id DESC"),this.#N=this.#e.prepare(`SELECT c.title, c.content, c.content_type, s.label
       FROM chunks c
       JOIN sources s ON s.id = c.source_id
       WHERE c.source_id = ?
       ORDER BY c.rowid`),this.#C=this.#e.prepare("SELECT chunk_count FROM sources WHERE id = ?"),this.#L=this.#e.prepare("SELECT content FROM chunks WHERE source_id = ?"),this.#O=this.#e.prepare("SELECT label, chunk_count, code_chunk_count, indexed_at, file_path, content_hash FROM sources WHERE label = ?"),this.#w=this.#e.prepare(`
      SELECT
        (SELECT COUNT(*) FROM sources) AS sources,
        (SELECT COUNT(*) FROM chunks) AS chunks,
        (SELECT COUNT(*) FROM chunks WHERE content_type = 'code') AS codeChunks
    `),this.#A=this.#e.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days'))"),this.#I=this.#e.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days'))"),this.#F=this.#e.prepare("DELETE FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days')")}setDenyChecker(e){this.#i=e}index(e){let{content:t,path:n,source:r,attribution:o}=e,i=typeof t=="string"&&t.length>0;if(!i&&!n)throw new Error("Either content or path must be provided");let a;if(i)a=t;else{let d=ae(n,"r");try{if(!ce(d).isFile())throw new Error(`refusing to index ${n}: not a regular file`);a=ie(d,"utf-8")}finally{ue(d)}}let c=r??n??"untitled",u=this.#q(a),l=n??void 0,h=l?le("sha256").update(a).digest("hex"):void 0;return O(()=>this.#r(u,c,a,l,h,o))}indexDirectory(e){let{path:t,source:n,attribution:r,perFileDeny:o,...i}=e,a=se(t,i),c=0,u=0,l=0,h=0;for(let d of a.files){if(o&&o(d)){l++;continue}try{let g=n?`${n}:${d}`:d,p=this.index({path:d,source:g,attribution:r});c++,u+=p.totalChunks}catch{h++}}return{filesIndexed:c,totalChunks:u,capped:a.capped,totalSeen:a.totalSeen,denied:l,failed:h,label:n??t}}indexPlainText(e,t,n=20,r){if(!e||e.trim().length===0)return this.#r([],t,"",void 0,void 0,r);let o=this.#G(e,n);return O(()=>this.#r(o.map(i=>({...i,hasCode:!1})),t,e,void 0,void 0,r))}indexJSON(e,t,n=de,r){if(!e||e.trim().length===0)return this.indexPlainText("",t,void 0,r);let o;try{o=JSON.parse(e)}catch{return this.indexPlainText(e,t,void 0,r)}let i=[];return this.#j(o,[],i,n),i.length===0?this.indexPlainText(e,t,void 0,r):O(()=>this.#r(i,t,e,void 0,void 0,r))}#r(e,t,n,r,o,i){let a=e.filter(d=>d.hasCode).length,c=i?.sessionId??"",u=i?.eventId??"",h=this.#e.transaction(()=>{if(this.#d.run(t),this.#h.run(t),this.#g.run(t),e.length===0){let E=this.#o.run(t,r??null,o??null);return Number(E.lastInsertRowid)}let d=this.#a.run(t,e.length,a,r??null,o??null),g=Number(d.lastInsertRowid),p=new Date().toISOString();for(let E of e){let m=E.hasCode?"code":"prose";this.#c.run(E.title,E.content,g,m,null,c,u,p),this.#u.run(E.title,E.content,g,m,null,c,u,p)}return g})();return n&&this.#Y(n),this.#M++,this.#M%s.OPTIMIZE_EVERY===0&&this.#B(),{sourceId:h,label:t,totalChunks:e.length,codeChunks:a}}#P(e){return e.map(t=>({title:t.title,content:t.content,source:t.label,rank:t.rank,contentType:t.content_type,highlighted:t.highlighted,timestamp:t.timestamp??void 0,sessionId:t.session_id??""}))}#s(e,t){return t==="exact"?e:`%${e.replace(/\\/g,"\\\\").replace(/%/g,"\\%").replace(/_/g,"\\_")}%`}search(e,t=3,n,r="AND",o,i="like"){let a=st(e,r),c,u;return n&&o?(c=i==="exact"?this.#R:this.#T,u=[a,this.#s(n,i),o,t]):n?(c=i==="exact"?this.#f:this.#m,u=[a,this.#s(n,i),t]):o?(c=this.#b,u=[a,o,t]):(c=this.#p,u=[a,t]),O(()=>this.#P(c.all(...u)))}searchTrigram(e,t=3,n,r="AND",o,i="like"){let a=it(e,r);if(!a)return[];let c,u;return n&&o?(c=i==="exact"?this.#D:this.#k,u=[a,this.#s(n,i),o,t]):n?(c=i==="exact"?this.#S:this.#_,u=[a,this.#s(n,i),t]):o?(c=this.#x,u=[a,o,t]):(c=this.#E,u=[a,t]),O(()=>this.#P(c.all(...u)))}fuzzyCorrect(e){let t=e.toLowerCase().trim();if(t.length<3)return null;if(this.#t.has(t)){let u=this.#t.get(t)??null;return this.#t.delete(t),this.#t.set(t,u),u}let n=at(t.length),r=this.#y.all(t.length-n,t.length+n),o=null,i=n+1,a=!1;for(let{word:u}of r){if(u===t){a=!0;break}let l=ot(t,u);l<i&&(i=l,o=u)}let c=a?null:i<=n?o:null;if(this.#t.size>=s.FUZZY_CACHE_SIZE){let u=this.#t.keys().next().value;u!==void 0&&this.#t.delete(u)}return this.#t.set(t,c),c}#U(e,t,n,r,o="like"){let a=Math.max(t*2,10),c=this.search(e,a,n,"OR",r,o),u=this.searchTrigram(e,a,n,"OR",r,o),l=new Map,h=d=>`${d.source}::${d.title}`;for(let[d,g]of c.entries()){let p=h(g),E=l.get(p);E?E.score+=1/(60+d+1):l.set(p,{result:g,score:1/(60+d+1)})}for(let[d,g]of u.entries()){let p=h(g),E=l.get(p);E?E.score+=1/(60+d+1):l.set(p,{result:g,score:1/(60+d+1)})}return Array.from(l.values()).sort((d,g)=>g.score-d.score).slice(0,t).map(({result:d,score:g})=>({...d,rank:-g}))}#$(e,t){let n=t.toLowerCase().split(/\s+/).filter(i=>i.length>=2),r=n.filter(i=>!A.has(i)),o=r.length>0?r:n;return e.map(i=>{let a=i.title.toLowerCase(),c=o.filter(g=>a.includes(g)).length,u=i.contentType==="code"?.6:.3,l=c>0?u*(c/o.length):0,h=0,d=0;if(o.length>=2){let g=i.content.toLowerCase(),p=o.map(E=>ct(g,E));if(!p.some(E=>E.length===0)){h=1/(1+lt(p)/Math.max(g.length,1));let m=ut(p,o);d=.5*Math.min(1,m/4)}}return{result:i,boost:l+h+d}}).sort((i,a)=>a.boost-i.boost||i.result.rank-a.result.rank).map(({result:i})=>i)}searchWithFallback(e,t=3,n,r,o="like",i){this.#V();let a=i?Math.max(t*8,40):t,c=this.#X(i),u=this.#U(e,a,n,r,o),l=c?u.filter(c):u;if(l.length>0)return this.#$(l.slice(0,t),e).map(m=>({...m,matchLayer:"rrf"}));let h=e.toLowerCase().trim().split(/\s+/).filter(E=>E.length>=3&&!A.has(E)),d=h.join(" "),p=h.map(E=>this.fuzzyCorrect(E)??E).join(" ");if(p!==d){let E=this.#U(p,a,n,r,o),m=c?E.filter(c):E;if(m.length>0)return this.#$(m.slice(0,t),p).map(f=>({...f,matchLayer:"rrf-fuzzy"}))}return[]}#X(e){return e?t=>{let n=t.sessionId??"";return n===""||e.has(n)}:null}lastRefreshCount=0;#V(){this.lastRefreshCount=0;let e=this.#e.prepare("SELECT label, file_path, content_hash, indexed_at FROM sources WHERE file_path IS NOT NULL").all();for(let t of e)try{if(!tt(t.file_path)||this.#i&&this.#i(t.file_path))continue;let n=oe(t.file_path).mtime,r=new Date(t.indexed_at+"Z");if(n<=r)continue;let o=ae(t.file_path,"r"),i;try{if(!ce(o).isFile())continue;i=ie(o,"utf-8")}finally{ue(o)}if(le("sha256").update(i).digest("hex")===t.content_hash)continue;this.index({content:i,path:t.file_path,source:t.label}),this.lastRefreshCount++}catch{}}getSourceMeta(e){let t=this.#O.get(e);return t?{label:t.label,chunkCount:t.chunk_count,codeChunkCount:t.code_chunk_count,indexedAt:t.indexed_at,filePath:t.file_path??null,contentHash:t.content_hash??null}:null}listSources(){return this.#v.all()}getIndexState(){let e=this.#e.prepare("SELECT COALESCE(SUM(chunk_count), 0) AS total_chunks, COUNT(*) AS total_sources, MAX(indexed_at) AS last_indexed_at FROM sources").get();return{totalChunks:e.total_chunks??0,totalSources:e.total_sources??0,lastIndexedAt:e.last_indexed_at??void 0}}getChunksBySource(e){return this.#N.all(e).map(n=>({title:n.title,content:n.content,source:n.label,rank:0,contentType:n.content_type}))}getDistinctiveTerms(e,t=40){let n=this.#C.get(e);if(!n||n.chunk_count<3)return[];let r=n.chunk_count,o=2,i=Math.max(3,Math.ceil(r*.4)),a=new Map;for(let l of this.#L.iterate(e)){let h=new Set(l.content.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(d=>d.length>=3&&!A.has(d)));for(let d of h)a.set(d,(a.get(d)??0)+1)}return Array.from(a.entries()).filter(([,l])=>l>=o&&l<=i).map(([l,h])=>{let d=Math.log(r/h),g=Math.min(l.length/20,.5),p=/[_]/.test(l),E=l.length>=12,m=p?1.5:E?.8:0;return{word:l,score:d+g+m}}).sort((l,h)=>h.score-l.score).slice(0,t).map(l=>l.word)}getStats(){let e=this.#w.get();return{sources:e?.sources??0,chunks:e?.chunks??0,codeChunks:e?.codeChunks??0}}cleanupStaleSources(e){return this.#e.transaction(r=>(this.#A.run(r),this.#I.run(r),this.#F.run(r)))(e).changes}getDBSizeBytes(){try{return oe(this.#n).size}catch{return 0}}#B(){try{this.#e.exec("INSERT INTO chunks(chunks) VALUES('optimize')"),this.#e.exec("INSERT INTO chunks_trigram(chunks_trigram) VALUES('optimize')")}catch{}}close(){this.#B(),X(this.#e)}#Y(e){let t=e.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(o=>o.length>=3&&!A.has(o)),n=[...new Set(t)],r=0;this.#e.transaction(()=>{for(let o of n){let i=this.#l.run(o);r+=i.changes}})(),r>0&&this.#t.clear()}#q(e,t=de){let n=[],r=e.split(`
`),o=[],i=[],a="",c=()=>{let l=i.join(`
`).trim();if(l.length===0)return;let h=this.#Q(o,a),d=i.some(_=>/^`{3,}/.test(_));if(Buffer.byteLength(l)<=t){n.push({title:h,content:l,hasCode:d}),i=[];return}let g=l.split(/\n\n+/),p=[],E=1,m=()=>{if(p.length===0)return;let _=p.join(`

`).trim();if(_.length===0)return;let f=g.length>1?`${h} (${E})`:h;E++,n.push({title:f,content:_,hasCode:_.includes("```")}),p=[]};for(let _ of g){p.push(_);let f=p.join(`

`);Buffer.byteLength(f)>t&&p.length>1&&(p.pop(),m(),p=[_])}m(),i=[]},u=0;for(;u<r.length;){let l=r[u];if(/^[-_*]{3,}\s*$/.test(l)){c(),u++;continue}let h=l.match(/^(#{1,4})\s+(.+)$/);if(h){c();let g=h[1].length,p=h[2].trim();for(;o.length>0&&o[o.length-1].level>=g;)o.pop();o.push({level:g,text:p}),a=p,i.push(l),u++;continue}let d=l.match(/^(`{3,})(.*)?$/);if(d){let g=d[1],p=[l];for(u++;u<r.length;){if(p.push(r[u]),r[u].startsWith(g)&&r[u].trim()===g){u++;break}u++}i.push(...p);continue}i.push(l),u++}return c(),n}#G(e,t){let n=e.split(/\n\s*\n/);if(n.length>=3&&n.length<=200&&n.every(c=>Buffer.byteLength(c)<5e3))return n.map((c,u)=>{let l=c.trim();return{title:l.split(`
`)[0].slice(0,80)||`Section ${u+1}`,content:l}}).filter(c=>c.content.length>0);let r=e.split(`
`);if(r.length<=t)return[{title:"Output",content:e}];let o=[],a=Math.max(t-2,1);for(let c=0;c<r.length;c+=a){let u=r.slice(c,c+t);if(u.length===0)break;let l=c+1,h=Math.min(c+u.length,r.length),d=u[0]?.trim().slice(0,80);o.push({title:d||`Lines ${l}-${h}`,content:u.join(`
`)})}return o}#j(e,t,n,r){let o=t.length>0?t.join(" > "):"(root)",i=JSON.stringify(e,null,2);if(Buffer.byteLength(i)<=r&&!(typeof e=="object"&&e!==null&&!Array.isArray(e)&&Object.values(e).some(c=>typeof c=="object"&&c!==null))){n.push({title:o,content:i,hasCode:!0});return}if(typeof e=="object"&&e!==null&&!Array.isArray(e)){let a=Object.entries(e);if(a.length>0){for(let[c,u]of a)this.#j(u,[...t,c],n,r);return}n.push({title:o,content:i,hasCode:!0});return}if(Array.isArray(e)){this.#J(e,t,n,r);return}n.push({title:o,content:i,hasCode:!1})}#z(e){if(e.length===0)return null;let t=e[0];if(typeof t!="object"||t===null||Array.isArray(t))return null;let n=["id","name","title","path","slug","key","label"],r=t;for(let o of n)if(o in r&&(typeof r[o]=="string"||typeof r[o]=="number"))return o;return null}#K(e,t,n,r,o){let i=e?`${e} > `:"";if(!o)return t===n?`${i}[${t}]`:`${i}[${t}-${n}]`;let a=c=>String(c[o]);return r.length===1?`${i}${a(r[0])}`:r.length<=3?i+r.map(a).join(", "):`${i}${a(r[0])}\u2026${a(r[r.length-1])}`}#J(e,t,n,r){let o=t.length>0?t.join(" > "):"(root)",i=this.#z(e),a=[],c=0,u=l=>{if(a.length===0)return;let h=this.#K(o,c,l,a,i);n.push({title:h,content:JSON.stringify(a,null,2),hasCode:!0})};for(let l=0;l<e.length;l++){a.push(e[l]);let h=JSON.stringify(a,null,2);Buffer.byteLength(h)>r&&a.length>1&&(a.pop(),u(l-1),a=[e[l]],c=l)}u(c+a.length-1)}#Q(e,t){return e.length===0?t||"Untitled":e.map(n=>n.text).join(" > ")}};import{createHash as fe}from"node:crypto";import{accessSync as hn,constants as gn,existsSync as ge,mkdirSync as pn,realpathSync as mn,renameSync as pe}from"node:fs";import{dirname as En,isAbsolute as _n,join as me,resolve as Sn}from"node:path";function Ee(s){let e=s.replace(/\\/g,"/");return/^\/+$/.test(e)?"/":/^[A-Za-z]:\/+$/.test(e)?`${e.slice(0,2)}/`:e.replace(/\/+$/,"")}function dt(s){return fe("sha256").update(Ee(s)).digest("hex").slice(0,16)}function ht(s){let e=Ee(s),t=process.platform==="darwin"||process.platform==="win32"?e.toLowerCase():e;return fe("sha256").update(t).digest("hex").slice(0,16)}function _e(s){let{projectDir:e,contentDir:t}=s,n=ht(e),r=me(t,`${n}.db`);if(ge(r))return r;let o=dt(e);if(o===n)return r;let i=me(t,`${o}.db`);if(ge(i))try{pe(i,r);for(let a of["-wal","-shm"])try{pe(i+a,r+a)}catch{}}catch{}return r}function Te(s){let e=P(s);for(;;){let t=V(e,".claude","context-mode.json");try{let r=Se(t,"utf-8");return{config:JSON.parse(r),configPath:t}}catch{}let n=ft(e);if(n===e)break;e=n}return null}function _t(s,e){let t=e.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${t}$`).test(s)}function Y(s,e,t){let n=[];try{let r=gt(s);for(let o of r){let i=V(s,o);try{let a=ye(i);a.isDirectory()&&t?n.push(...Y(i,e,!0)):a.isFile()&&_t(o,e)&&n.push(i)}catch{}}}catch{}return n}function M(s,e){try{let t=Se(s,"utf-8");return t.trim().length===0?null:{name:e?Et(e,s):be(s),path:s,content:t}}catch{return null}}function St(s){if(s.paths){let e=s.path||".";return s.paths.map(t=>P(e,t)).map(t=>M(t,e)).filter(t=>t!==null)}if(s.exec){let e=s.path||process.cwd();try{let t=mt(s.exec,{cwd:e,encoding:"utf-8",timeout:1e4}).trim(),n=JSON.parse(t);return Array.isArray(n)?n.map(r=>P(e,r)).map(r=>M(r,e)).filter(r=>r!==null):(process.stderr.write(`[context-wrapper] exec for "${s.label}" did not return an array
`),[])}catch(t){return process.stderr.write(`[context-wrapper] exec for "${s.label}" failed: ${t.message}
`),[]}}return s.glob&&s.path?Y(s.path,s.glob,!!s.recursive).map(e=>M(e,s.path)).filter(e=>e!==null):(process.stderr.write(`[context-wrapper] source "${s.label}" has no file selection strategy (need glob+path, exec, or paths)
`),[])}function yt(s){if(!s.startsWith("---"))return s;let e=s.indexOf(`
---`,3);return e===-1?s:s.slice(e+4).replace(/^\n+/,"")}function bt(s,e){let t=e.match(/^(\d{4}-\d{2}-\d{2})\.md$/);if(!t)return s;let n=t[1],r=s.split(`
`),o=[];for(let i of r){if(/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(i))continue;let a=i.match(/^(##\s+)(.+)$/);a?o.push(`${a[1]}[${n}] ${a[2]}`):o.push(i)}return o.join(`
`)}function Tt(s){return s.replace(/\n{3,}/g,`

`)}function Re(s,e,t){let n=s;return t?.stripFrontmatter&&(n=yt(n)),t?.prefixDates&&(n=bt(n,e)),Tt(n)}function Rt(s,e){return Re(s.content,s.name,{stripFrontmatter:e.stripFrontmatter,prefixDates:e.prefixDates})}function xt(s,e){let t=V(s,"content");return pt(t,{recursive:!0}),_e({projectDir:P(e),contentDir:t})}function xe(s){let e=P(s.path),t=ye(e),n=String(s.source??be(e));if(t.isDirectory()){let o=s.glob??"*.md",i=s.recursive!==!1,a=Y(e,o,i).map(c=>M(c,e)).filter(c=>c!==null);return{basePath:e,isDirectory:!0,files:a,sourcePrefix:n}}let r=M(e);return{basePath:e,isDirectory:!1,files:r?[r]:[],sourcePrefix:n}}function ke(s,e){let t=e?.stripFrontmatter!==!1,n=e?.prefixDates===!0;return s.map(r=>({file:r,content:Re(r.content,r.name,{stripFrontmatter:t,prefixDates:n})})).filter(r=>r.content.trim().length>0).map(r=>({...r,source:r.file.name}))}function De(s,e,t){let n=xt(e,t),r=new U(n),o=0,i=0,a=new Map;for(let c of s.sources){let u=St(c);if(u.length!==0)for(let l of u){let h=Rt(l,c);if(h.trim().length===0)continue;let d=`${c.label}: ${l.name}`,g=r.index({content:h,source:d});o++,i+=g.totalChunks;let p=a.get(c.label)??{label:c.label,description:c.description,files:0,chunks:0};p.files++,p.chunks+=g.totalChunks,a.set(c.label,p)}}return r.close(),{totalSources:o,totalChunks:i,dbPath:n,sources:[...a.values()]}}function ve(s){return s.length===0?null:`Pre-warmed at startup and searchable now (no \`index\` call needed): ${s.map(t=>{let n=`\`${t.label}\` (${t.files} file${t.files===1?"":"s"})`;return t.description?`${n} \u2014 ${t.description}`:n}).join("; ")}. Scope to one with \`source: "<label>"\`.`}function kt(s){return s.replace(/^⚠️ context-mode v[^\n]+ outdated → v[^\n]+ available\. Upgrade: [^\n]+\n\n/,"")}function Ne(s){let e=s?.content;if(Array.isArray(e))for(let t of e)t?.type==="text"&&typeof t.text=="string"&&(t.text=kt(t.text))}function Ce(s,e){let t=s?.content;if(Array.isArray(t))for(let n of t){if(n?.type!=="text"||typeof n.text!="string")continue;let r=/\n\n⚠ search call #\d+\/\d+ in this window\..+$/s,o=/^BLOCKED: \d+ search calls in \d+s\..+$/s;r.test(n.text)?n.text=e===!1?n.text.replace(r,""):n.text.replace(r,`

${e}`):o.test(n.text)&&(n.text=e===!1?"":String(e))}}var Ae={execute:"ctx_execute",index:"ctx_index",search:"ctx_search",fetch_and_index:"ctx_fetch_and_index",batch_execute:"ctx_batch_execute"},Oe=new Map(Object.entries(Ae).map(([s,e])=>[e,s])),Ut=new Set(["ctx_stats","ctx_doctor","ctx_upgrade","ctx_purge","ctx_insight"]),$={execute:"Run code in the upstream sandbox. Use for derivation over files, command output, or fetched data without dumping raw bytes into context. When `path` is provided, the file is exposed inside the sandbox as FILE_CONTENT.",search:"Search indexed content with BM25/FTS5 ranking. Use after prewarm, index, fetch_and_index, batch_execute, or batch_read. Scope with `source` when you want results from a specific label or batch.",fetch_and_index:"Fetch one or more URLs, convert/index the content, and make it searchable. Use when the source is remote and you want retrieval via `search` instead of pasting raw page content into context.",batch_execute:"Run multiple shell commands, index their outputs, and optionally query the results in the same call. Use for multi-step collection where raw command output should converge into searchable indexed content."},$t=new Set(["apps","packages","src","lib"]);function Bt(s){let e=s.split("/").filter(Boolean),t=-1;for(let r=e.length-1;r>=0;r--)if($t.has(e[r])){t=r;break}let n=t>=0?e.slice(t+1):e.slice(-2);return n=n.filter(r=>r!=="src"),n.join("/")}function jt(s){let e=new Map;return s.map(t=>{let n=(e.get(t)??0)+1;return e.set(t,n),n>1?`${t} (${n})`:t})}function Ht(s){let t=(s?.content?.[0]?.text??"").match(/^Indexed (\d+) sections/);return t?parseInt(t[1],10):0}async function Wt(){let s=process.cwd(),e=Te(s),t=vt(Le(Dt(),"context-mode-")),n=we(wt(import.meta.url)),r=n.endsWith("/src")?we(n):n,o=Le(r,"node_modules","context-mode","server.bundle.mjs"),i=new Ft({command:"node",args:[o],cwd:s,env:{...process.env,CONTEXT_MODE_DIR:t,CONTEXT_MODE_PROJECT_DIR:s,CLAUDE_PROJECT_DIR:s,PWD:s},stderr:"inherit"}),a=new It({name:"context-wrapper",version:"0.2.0"});await a.connect(i);let c=i.pid;if(!c)throw new Error("Failed to get upstream server PID");process.stderr.write(`[context-wrapper] Connected to upstream server (pid ${c})
`);let u=$.search;if(e){let m=performance.now(),_=De(e.config,t,s),f=(performance.now()-m).toFixed(0);process.stderr.write(`[context-wrapper] Pre-warmed ${_.totalChunks} chunks from ${_.totalSources} files in ${f}ms (${_.dbPath})
`);let T=ve(_.sources);T&&(u+=`

${T}`)}let{tools:l}=await a.listTools(),h=l.find(m=>m.name==="ctx_execute_file"),d=l.filter(m=>!Ut.has(m.name)).filter(m=>m.name!=="ctx_execute_file").filter(m=>Oe.has(m.name)).map(m=>{let _=Oe.get(m.name);if(_==="execute"&&h){let f={...m.inputSchema.properties??{}};return h.inputSchema.properties?.path?f.path=h.inputSchema.properties.path:f.path={type:"string",description:"Absolute file path or relative to project root. When provided, reads this file into a FILE_CONTENT variable inside the sandbox \u2014 file contents stay in sandbox, only your printed output enters context."},{...m,name:_,description:$.execute,inputSchema:{...m.inputSchema,properties:f}}}return _==="index"?{...m,name:_,description:"Store content in the searchable BM25 knowledge base. When `content` is provided, it is indexed directly. When `path` is provided, the wrapper reads files relative to the agent cwd, applies markdown preprocessing, and indexes each file as its own source.",inputSchema:{type:"object",properties:{content:{type:"string",description:"Raw text/markdown to index. Provide this OR path, not both."},path:{type:"string",description:"File or directory path to index. Relative paths resolve from the current working directory/worktree."},source:{type:"string",description:'Source label. For directories, each file gets "{source}: {relative/path}". Defaults to the directory basename or resolved file path.'},glob:{type:"string",description:'Directory-only filename pattern. Defaults to "*.md".'},recursive:{type:"boolean",description:"Directory-only recursive walk flag. Defaults to true."},stripFrontmatter:{type:"boolean",description:"Path-based indexing only. Strip YAML frontmatter before indexing. Defaults to true."},prefixDates:{type:"boolean",description:"Path-based indexing only. For YYYY-MM-DD.md files, prefix ## headings with [date]. Defaults to false."}}}}:_==="search"?{...m,name:_,description:u}:_==="fetch_and_index"?{...m,name:_,description:$.fetch_and_index}:_==="batch_execute"?{...m,name:_,description:$.batch_execute}:{...m,name:_}});d.push({name:"batch_read",description:"Read multiple files, index them, and search across their contents. Use instead of batch_execute when all inputs are known file paths (no shell commands needed). Labels are auto-derived from file paths. Returns BM25 search results plus a batch ID \u2014 pass the batch ID as `source` to `search` for follow-up questions scoped to exactly these files.",inputSchema:{type:"object",properties:{files:{type:"array",items:{type:"string"},description:"File paths to read and index. Absolute paths preferred; relative paths resolve from the current working directory.",minItems:1},queries:{type:"array",items:{type:"string"},description:"Search queries to run against the indexed content. Use 5\u20138 comprehensive queries. Each returns top matching sections.",minItems:1}},required:["files","queries"],additionalProperties:!1}});let g=new Ot({name:"context-wrapper",version:"0.2.0"},{capabilities:{tools:{}}});g.setRequestHandler(Mt,async()=>({tools:d})),g.setRequestHandler(Pt,async m=>{let{name:_,arguments:f}=m.params;if(_==="index"&&f?.path!==void 0){let R=q(s,String(f.path)),S;try{S=xe({path:R,source:typeof f.source=="string"?f.source:void 0,glob:typeof f.glob=="string"?f.glob:void 0,recursive:typeof f.recursive=="boolean"?f.recursive:void 0,stripFrontmatter:typeof f.stripFrontmatter=="boolean"?f.stripFrontmatter:void 0,prefixDates:typeof f.prefixDates=="boolean"?f.prefixDates:void 0})}catch(y){return{content:[{type:"text",text:`Index error: ${y.message}`}],isError:!0}}if(S.files.length===0)return{content:[{type:"text",text:S.isDirectory?`No files matched in ${S.basePath}.`:`Nothing indexable found at ${S.basePath}.`}]};let x=ke(S.files,{stripFrontmatter:typeof f.stripFrontmatter=="boolean"?f.stripFrontmatter:void 0,prefixDates:typeof f.prefixDates=="boolean"?f.prefixDates:void 0}),k=0,D=0,b=[];for(let y of x){let C=S.isDirectory?`${S.sourcePrefix}: ${y.source}`:String(f.source??S.basePath);try{let v=await a.callTool({name:"ctx_index",arguments:{content:y.content,source:C}});D+=Ht(v),k++}catch(v){b.push(`${y.file.name}: ${v.message}`)}}let I=S.isDirectory?`Indexed ${k} file${k===1?"":"s"} (${D} chunks) from ${S.basePath}`:`Indexed ${D} sections from: ${String(f.source??S.basePath)}`;return{content:[{type:"text",text:b.length>0?`${I}

Errors (${b.length}):
${b.join(`
`)}`:I}],isError:b.length>0&&k===0}}if(_==="batch_read"){let{files:R,queries:S}=f,x=Lt(3).toString("hex"),k=R.map(N=>Bt(q(s,N))),D=jt(k),b=[];for(let N=0;N<R.length;N++){let G=q(s,R[N]),Ie=`${x}/${D[N]}`,z;try{z=Nt(G,"utf-8")}catch{b.push(G);continue}await a.callTool({name:"ctx_index",arguments:{content:z,source:Ie}})}let y=(await a.callTool({name:"ctx_search",arguments:{queries:S,source:x,limit:3}})).content?.[0]?.text??"(no results)",C=b.length>0?`

\u26A0 Could not read ${b.length} file(s):
${b.map(N=>`  - ${N}`).join(`
`)}`:"",v=`

---
**Batch ID:** \`${x}\`
To search only these files: \`search(queries: [...], source: "${x}")\``;return{content:[{type:"text",text:y+C+v}]}}let T;if(_==="execute"&&f?.path!==void 0?T="ctx_execute_file":T=Ae[_],!T)return{content:[{type:"text",text:`Unknown tool: ${_}`}],isError:!0};let L=await a.callTool({name:T,arguments:f});return Ne(L),_==="search"&&e?.config.searchReminder!==void 0&&Ce(L,e.config.searchReminder),L});let p=new At;await g.connect(p),process.stderr.write(`[context-wrapper] MCP server ready (${d.length} tools) [tmp=${t}]
`);let E=async()=>{await Promise.allSettled([a.close(),g.close()])};process.stdin.on("end",()=>process.exit(0)),process.on("SIGINT",async()=>{await E(),process.exit(0)}),process.on("SIGTERM",async()=>{await E(),process.exit(0)}),process.on("exit",()=>{try{process.kill(c)}catch{}try{Ct(t,{recursive:!0,force:!0})}catch{}})}Wt().catch(s=>{process.stderr.write(`[context-wrapper] Fatal: ${s.message}
${s.stack}
`),process.exit(1)});
