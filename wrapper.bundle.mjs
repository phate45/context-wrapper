import{join as vt,dirname as Dt,resolve as Y}from"node:path";import{tmpdir as be}from"node:os";import{mkdtempSync as Te,readFileSync as Re,rmSync as ke}from"node:fs";import{randomBytes as xe}from"node:crypto";import{fileURLToPath as ve}from"node:url";import{Server as De}from"@modelcontextprotocol/sdk/server/index.js";import{StdioServerTransport as Ne}from"@modelcontextprotocol/sdk/server/stdio.js";import{Client as we}from"@modelcontextprotocol/sdk/client/index.js";import{StdioClientTransport as Ce}from"@modelcontextprotocol/sdk/client/stdio.js";import{ListToolsRequestSchema as Le,CallToolRequestSchema as Oe}from"@modelcontextprotocol/sdk/types.js";import{readFileSync as yt,readdirSync as ue,statSync as _t,mkdirSync as le}from"node:fs";import{execSync as de}from"node:child_process";import{join as X,dirname as he,basename as St,resolve as P,relative as ge}from"node:path";import{createRequire as Lt}from"node:module";import{existsSync as Ot,unlinkSync as q,renameSync as je}from"node:fs";var $=class{#t;constructor(t){this.#t=t}pragma(t){let n=this.#t.prepare(`PRAGMA ${t}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let r=Object.values(n[0]);return r.length===1?r[0]:n[0]}exec(t){let e="",n=null;for(let o=0;o<t.length;o++){let i=t[o];if(n)e+=i,i===n&&(n=null);else if(i==="'"||i==='"')e+=i,n=i;else if(i===";"){let a=e.trim();a&&this.#t.prepare(a).run(),e=""}else e+=i}let r=e.trim();return r&&this.#t.prepare(r).run(),this}prepare(t){let e=this.#t.prepare(t);return{run:(...n)=>e.run(...n),get:(...n)=>{let r=e.get(...n);return r===null?void 0:r},all:(...n)=>e.all(...n),iterate:(...n)=>e.iterate(...n)}}transaction(t){return this.#t.transaction(t)}close(){this.#t.close()}},B=class{#t;constructor(t){this.#t=t}pragma(t){let n=this.#t.prepare(`PRAGMA ${t}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let r=Object.values(n[0]);return r.length===1?r[0]:n[0]}exec(t){return this.#t.exec(t),this}prepare(t){let e=this.#t.prepare(t);return{run:(...n)=>e.run(...n),get:(...n)=>e.get(...n),all:(...n)=>e.all(...n),iterate:(...n)=>typeof e.iterate=="function"?e.iterate(...n):e.all(...n)[Symbol.iterator]()}}transaction(t){return(...e)=>{this.#t.exec("BEGIN");try{let n=t(...e);return this.#t.exec("COMMIT"),n}catch(n){throw this.#t.exec("ROLLBACK"),n}}}close(){this.#t.close()}},C=null;function It(s){let t=null;try{return t=new s(":memory:"),t.exec("CREATE VIRTUAL TABLE __fts5_probe USING fts5(x)"),!0}catch{return!1}finally{try{t?.close()}catch{}}}function At(s,t){let e=t!==void 0?t:globalThis.Bun;if(typeof e<"u"&&e!==null)return!0;let n=s??process.versions,[r,o]=(n.node??"0.0.0").split("."),i=Number(r),a=Number(o);return!Number.isFinite(i)||!Number.isFinite(a)?!1:i>22||i===22&&a>=5}function K(){if(!C){let s=Lt(import.meta.url);if(globalThis.Bun){let t=s(["bun","sqlite"].join(":")).Database;C=function(n,r){let o=new t(n,{readonly:r?.readonly,create:!0}),i=new $(o);return r?.timeout&&i.pragma(`busy_timeout = ${r.timeout}`),i}}else if(At()){let t=null;try{({DatabaseSync:t}=s(["node","sqlite"].join(":")))}catch{t=null}t&&It(t)?C=function(n,r){let o=new t(n,{readOnly:r?.readonly??!1}),i=new B(o);return r?.timeout&&i.pragma(`busy_timeout = ${r.timeout}`),i}:C=s("better-sqlite3")}else C=s("better-sqlite3")}return C}function j(s){s.pragma("journal_mode = WAL"),s.pragma("synchronous = NORMAL");try{s.pragma("mmap_size = 268435456")}catch{}}function W(s){if(!Ot(s))for(let t of["-wal","-shm"])try{q(s+t)}catch{}}function J(s){for(let t of["","-wal","-shm"])try{q(s+t)}catch{}}function H(s){try{s.pragma("wal_checkpoint(TRUNCATE)")}catch{}try{s.close()}catch{}}function L(s,t=[100,500,2e3]){let e;for(let n=0;n<=t.length;n++)try{return s()}catch(r){let o=r instanceof Error?r.message:String(r);if(!o.includes("SQLITE_BUSY")&&!o.includes("database is locked"))throw r;if(e=r instanceof Error?r:new Error(o),n<t.length){let i=t[n],a=Date.now();for(;Date.now()-a<i;);}}throw new Error(`SQLITE_BUSY: database is locked after ${t.length} retries. Original error: ${e?.message}`)}function Q(s){return s.includes("SQLITE_CORRUPT")||s.includes("SQLITE_NOTADB")||s.includes("database disk image is malformed")||s.includes("file is not a database")}var A=Symbol.for("__context_mode_live_dbs_v3__"),We=(()=>{let s=globalThis;return s[A]||(s[A]=new Set,process.on("exit",()=>{for(let t of s[A])H(t);s[A].clear()})),s[A]})();import{readFileSync as st,readdirSync as qe,unlinkSync as Kt,existsSync as Jt,statSync as it,openSync as ot,fstatSync as at,closeSync as ct}from"node:fs";import{createHash as ut}from"node:crypto";import{tmpdir as Qt}from"node:os";import{join as Zt}from"node:path";import{readdirSync as Ft,statSync as Pt,lstatSync as Mt,realpathSync as Z,existsSync as Ut,readFileSync as $t}from"node:fs";import{join as et,extname as Bt,relative as nt,sep as jt,resolve as Wt}from"node:path";var Ht=["node_modules",".git","dist","build",".next","coverage",".venv","__pycache__",".DS_Store"],Xt=[".md",".mdx",".txt",".json",".yaml",".yml",".ts",".tsx",".js",".jsx",".py",".rs",".go",".sh"],Vt=5,Yt=200;function Gt(s){let t="";for(let e=0;e<s.length;e++){let n=s[e];n==="*"?s[e+1]==="*"?(t+=".*",e++):t+="[^/]*":n==="?"?t+="[^/]":"\\^$.|+()[]{}".includes(n)?t+="\\"+n:t+=n}return new RegExp(`^${t}$`)}function tt(s,t){if(t.length===0)return!1;let e=s.split("/").pop()??s;for(let n of t){if(!n.includes("/")&&!n.includes("*")){if(e===n||s.split("/").includes(n))return!0;continue}let r=Gt(n);if(r.test(s)||r.test(e))return!0}return!1}function zt(s){let t=et(s,".gitignore");if(!Ut(t))return[];try{return $t(t,"utf-8").split(/\r?\n/).map(n=>n.trim()).filter(n=>n.length>0&&!n.startsWith("#")&&!n.startsWith("!")).map(n=>n.replace(/^\//,"").replace(/\/$/,""))}catch{return[]}}function qt(s,t){return nt(s,t).split(jt).join("/")}function rt(s,t={}){let{include:e,exclude:n,maxDepth:r=Vt,maxFiles:o=Yt,extensions:i,respectGitignore:a=!0,followSymlinks:u=!1}=t,c;try{c=Z(s)}catch{return{files:[],capped:!1,totalSeen:0}}let l=(i&&i.length>0?i:Xt).map(S=>(S.startsWith(".")?S:"."+S).toLowerCase()),h=[...Ht,...n??[],...a?zt(c):[]],d=e??[],p=[],f=new Set([c]),g=0,E=!1;function m(S,I){if(E||I>r)return;let b;try{b=Ft(S,{withFileTypes:!0})}catch{return}for(let _ of b){if(E)return;let y=et(S,_.name),T=qt(c,y);if(tt(T,h))continue;let v=_.isDirectory(),R=_.isFile(),w=!1;try{w=Mt(y).isSymbolicLink()}catch{continue}if(w){if(!u)continue;let k;try{k=Z(y)}catch{continue}let N=nt(c,k);if((N.startsWith("..")||Wt(N)===k)&&N.startsWith("..")||f.has(k))continue;f.add(k);try{let x=Pt(k);v=x.isDirectory(),R=x.isFile()}catch{continue}}if(v){m(y,I+1);continue}if(!R)continue;let D=Bt(y).toLowerCase();if(l.includes(D)&&!(d.length>0&&!tt(T,d))){if(g++,p.length>=o){E=!0;return}p.push(y)}}}return m(c,0),{files:p,capped:E,totalSeen:g}}var O=new Set(["the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","has","his","how","its","may","new","now","old","see","way","who","did","get","got","let","say","she","too","use","will","with","this","that","from","they","been","have","many","some","them","than","each","make","like","just","over","such","take","into","year","your","good","could","would","about","which","their","there","other","after","should","through","also","more","most","only","very","when","what","then","these","those","being","does","done","both","same","still","while","where","here","were","much","update","updates","updated","deps","dev","tests","test","add","added","fix","fixed","run","running","using"]);function dt(s){let t=new Set,e=[];for(let n of s){let r=n.toLowerCase();t.has(r)||(t.add(r),e.push(n))}return e}function te(s,t="AND"){let e=dt(s.replace(/['"(){}[\]*:^~]/g," ").split(/\s+/).filter(o=>o.length>0&&!["AND","OR","NOT","NEAR"].includes(o.toUpperCase())));if(e.length===0)return'""';let n=e.filter(o=>!O.has(o.toLowerCase()));return(n.length>0?n:e).map(o=>`"${o}"`).join(t==="OR"?" OR ":" ")}function ee(s,t="AND"){let e=s.replace(/["'(){}[\]*:^~]/g,"").trim();if(e.length<3)return"";let n=dt(e.split(/\s+/).filter(i=>i.length>=3));if(n.length===0)return"";let r=n.filter(i=>!O.has(i.toLowerCase()));return(r.length>0?r:n).map(i=>`"${i}"`).join(t==="OR"?" OR ":" ")}function ne(s,t){if(s.length===0)return t.length;if(t.length===0)return s.length;let e=Array.from({length:t.length+1},(n,r)=>r);for(let n=1;n<=s.length;n++){let r=[n];for(let o=1;o<=t.length;o++)r[o]=s[n-1]===t[o-1]?e[o-1]:1+Math.min(e[o],r[o-1],e[o-1]);e=r}return e[t.length]}function re(s){return s<=4?1:s<=12?2:3}var lt=4096;function se(s,t){let e=[],n=s.indexOf(t);for(;n!==-1;)e.push(n),n=s.indexOf(t,n+1);return e}function ie(s,t,e=30){if(s.length<2||t.length<2)return 0;let n=0,r=Math.min(s.length,t.length)-1;for(let o=0;o<r;o++){let i=s[o],a=s[o+1],u=t[o].length,c=0;for(let l of i){let h=l+u,d=h+e;for(;c<a.length&&a[c]<h;)c++;c<a.length&&a[c]<=d&&(n++,c++)}}return n}function oe(s){if(s.length===0)return 1/0;if(s.length===1)return 0;let t=s.map(r=>[...r].sort((o,i)=>o-i)),e=new Array(t.length).fill(0),n=1/0;for(;;){let r=1/0,o=-1/0,i=0;for(let u=0;u<t.length;u++){let c=t[u][e[u]];c<r&&(r=c,i=u),c>o&&(o=c)}let a=o-r;if(a<n&&(n=a),e[i]++,e[i]>=t[i].length)break}return n}var M=class s{#t;#n;#i;#o;#a;#c;#u;#l;#d;#h;#g;#p;#m;#f;#E;#y;#_;#S;#b;#T;#R;#k;#x;#v;#D;#N;#w;#C;#L;#O;#I;#A;#F;#P=0;static OPTIMIZE_EVERY=50;#e=new Map;static FUZZY_CACHE_SIZE=256;constructor(t){let e=K();this.#n=t??Zt(Qt(),`context-mode-${process.pid}.db`),W(this.#n);let n;try{n=new e(this.#n,{timeout:3e4}),j(n)}catch(r){let o=r instanceof Error?r.message:String(r);if(Q(o)){J(this.#n),W(this.#n);try{n=new e(this.#n,{timeout:3e4}),j(n)}catch(i){throw new Error(`Failed to create fresh DB after deleting corrupt file: ${i instanceof Error?i.message:String(i)}`)}}else throw r}this.#t=n,this.#W(),this.#H()}cleanup(){try{this.#t.close()}catch{}for(let t of["","-wal","-shm"])try{Kt(this.#n+t)}catch{}}#W(){this.#t.exec(`
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
    `);try{let t=this.#t.prepare("SELECT name FROM pragma_table_xinfo('chunks')").all(),e=new Set(t.map(n=>n.name));t.length>0&&!e.has("source_category")&&(this.#t.exec("DROP TABLE IF EXISTS chunks"),this.#t.exec("DROP TABLE IF EXISTS chunks_trigram"),this.#t.exec(`
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
        `))}catch{}try{this.#t.exec("ALTER TABLE sources ADD COLUMN file_path TEXT")}catch{}try{this.#t.exec("ALTER TABLE sources ADD COLUMN content_hash TEXT")}catch{}}#H(){this.#o=this.#t.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count, file_path, content_hash) VALUES (?, 0, 0, ?, ?)"),this.#a=this.#t.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count, file_path, content_hash) VALUES (?, ?, ?, ?, ?)"),this.#c=this.#t.prepare("INSERT INTO chunks (title, content, source_id, content_type, source_category, session_id, event_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"),this.#u=this.#t.prepare("INSERT INTO chunks_trigram (title, content, source_id, content_type, source_category, session_id, event_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"),this.#l=this.#t.prepare("INSERT OR IGNORE INTO vocabulary (word) VALUES (?)"),this.#d=this.#t.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#h=this.#t.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#g=this.#t.prepare("DELETE FROM sources WHERE label = ?"),this.#p=this.#t.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ?
      ORDER BY rank
      LIMIT ?
    `),this.#m=this.#t.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label LIKE ? ESCAPE '\\'
      ORDER BY rank
      LIMIT ?
    `),this.#f=this.#t.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label = ?
      ORDER BY rank
      LIMIT ?
    `),this.#E=this.#t.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ?
      ORDER BY rank
      LIMIT ?
    `),this.#y=this.#t.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label LIKE ? ESCAPE '\\'
      ORDER BY rank
      LIMIT ?
    `),this.#_=this.#t.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label = ?
      ORDER BY rank
      LIMIT ?
    `),this.#b=this.#t.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND chunks.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#T=this.#t.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label LIKE ? ESCAPE '\\' AND chunks.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#R=this.#t.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label = ? AND chunks.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#k=this.#t.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND chunks_trigram.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#x=this.#t.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label LIKE ? ESCAPE '\\' AND chunks_trigram.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#v=this.#t.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label = ? AND chunks_trigram.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#S=this.#t.prepare("SELECT word FROM vocabulary WHERE length(word) BETWEEN ? AND ?"),this.#D=this.#t.prepare("SELECT label, chunk_count as chunkCount FROM sources ORDER BY id DESC"),this.#N=this.#t.prepare(`SELECT c.title, c.content, c.content_type, s.label
       FROM chunks c
       JOIN sources s ON s.id = c.source_id
       WHERE c.source_id = ?
       ORDER BY c.rowid`),this.#w=this.#t.prepare("SELECT chunk_count FROM sources WHERE id = ?"),this.#C=this.#t.prepare("SELECT content FROM chunks WHERE source_id = ?"),this.#O=this.#t.prepare("SELECT label, chunk_count, code_chunk_count, indexed_at, file_path, content_hash FROM sources WHERE label = ?"),this.#L=this.#t.prepare(`
      SELECT
        (SELECT COUNT(*) FROM sources) AS sources,
        (SELECT COUNT(*) FROM chunks) AS chunks,
        (SELECT COUNT(*) FROM chunks WHERE content_type = 'code') AS codeChunks
    `),this.#I=this.#t.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days'))"),this.#A=this.#t.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days'))"),this.#F=this.#t.prepare("DELETE FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days')")}setDenyChecker(t){this.#i=t}index(t){let{content:e,path:n,source:r,attribution:o}=t,i=typeof e=="string"&&e.length>0;if(!i&&!n)throw new Error("Either content or path must be provided");let a;if(i)a=e;else{let d=ot(n,"r");try{if(!at(d).isFile())throw new Error(`refusing to index ${n}: not a regular file`);a=st(d,"utf-8")}finally{ct(d)}}let u=r??n??"untitled",c=this.#Y(a),l=n??void 0,h=l?ut("sha256").update(a).digest("hex"):void 0;return L(()=>this.#r(c,u,a,l,h,o))}indexDirectory(t){let{path:e,source:n,attribution:r,perFileDeny:o,...i}=t,a=rt(e,i),u=0,c=0,l=0,h=0;for(let d of a.files){if(o&&o(d)){l++;continue}try{let p=n?`${n}:${d}`:d,f=this.index({path:d,source:p,attribution:r});u++,c+=f.totalChunks}catch{h++}}return{filesIndexed:u,totalChunks:c,capped:a.capped,totalSeen:a.totalSeen,denied:l,failed:h,label:n??e}}indexPlainText(t,e,n=20,r){if(!t||t.trim().length===0)return this.#r([],e,"",void 0,void 0,r);let o=this.#G(t,n);return L(()=>this.#r(o.map(i=>({...i,hasCode:!1})),e,t,void 0,void 0,r))}indexJSON(t,e,n=lt,r){if(!t||t.trim().length===0)return this.indexPlainText("",e,void 0,r);let o;try{o=JSON.parse(t)}catch{return this.indexPlainText(t,e,void 0,r)}let i=[];return this.#j(o,[],i,n),i.length===0?this.indexPlainText(t,e,void 0,r):L(()=>this.#r(i,e,t,void 0,void 0,r))}#r(t,e,n,r,o,i){let a=t.filter(d=>d.hasCode).length,u=i?.sessionId??"",c=i?.eventId??"",h=this.#t.transaction(()=>{if(this.#d.run(e),this.#h.run(e),this.#g.run(e),t.length===0){let g=this.#o.run(e,r??null,o??null);return Number(g.lastInsertRowid)}let d=this.#a.run(e,t.length,a,r??null,o??null),p=Number(d.lastInsertRowid),f=new Date().toISOString();for(let g of t){let E=g.hasCode?"code":"prose";this.#c.run(g.title,g.content,p,E,null,u,c,f),this.#u.run(g.title,g.content,p,E,null,u,c,f)}return p})();return n&&this.#V(n),this.#P++,this.#P%s.OPTIMIZE_EVERY===0&&this.#B(),{sourceId:h,label:e,totalChunks:t.length,codeChunks:a}}#M(t){return t.map(e=>({title:e.title,content:e.content,source:e.label,rank:e.rank,contentType:e.content_type,highlighted:e.highlighted,timestamp:e.timestamp??void 0}))}#s(t,e){return e==="exact"?t:`%${t.replace(/\\/g,"\\\\").replace(/%/g,"\\%").replace(/_/g,"\\_")}%`}search(t,e=3,n,r="AND",o,i="like"){let a=te(t,r),u,c;return n&&o?(u=i==="exact"?this.#R:this.#T,c=[a,this.#s(n,i),o,e]):n?(u=i==="exact"?this.#f:this.#m,c=[a,this.#s(n,i),e]):o?(u=this.#b,c=[a,o,e]):(u=this.#p,c=[a,e]),L(()=>this.#M(u.all(...c)))}searchTrigram(t,e=3,n,r="AND",o,i="like"){let a=ee(t,r);if(!a)return[];let u,c;return n&&o?(u=i==="exact"?this.#v:this.#x,c=[a,this.#s(n,i),o,e]):n?(u=i==="exact"?this.#_:this.#y,c=[a,this.#s(n,i),e]):o?(u=this.#k,c=[a,o,e]):(u=this.#E,c=[a,e]),L(()=>this.#M(u.all(...c)))}fuzzyCorrect(t){let e=t.toLowerCase().trim();if(e.length<3)return null;if(this.#e.has(e)){let c=this.#e.get(e)??null;return this.#e.delete(e),this.#e.set(e,c),c}let n=re(e.length),r=this.#S.all(e.length-n,e.length+n),o=null,i=n+1,a=!1;for(let{word:c}of r){if(c===e){a=!0;break}let l=ne(e,c);l<i&&(i=l,o=c)}let u=a?null:i<=n?o:null;if(this.#e.size>=s.FUZZY_CACHE_SIZE){let c=this.#e.keys().next().value;c!==void 0&&this.#e.delete(c)}return this.#e.set(e,u),u}#U(t,e,n,r,o="like"){let a=Math.max(e*2,10),u=this.search(t,a,n,"OR",r,o),c=this.searchTrigram(t,a,n,"OR",r,o),l=new Map,h=d=>`${d.source}::${d.title}`;for(let[d,p]of u.entries()){let f=h(p),g=l.get(f);g?g.score+=1/(60+d+1):l.set(f,{result:p,score:1/(60+d+1)})}for(let[d,p]of c.entries()){let f=h(p),g=l.get(f);g?g.score+=1/(60+d+1):l.set(f,{result:p,score:1/(60+d+1)})}return Array.from(l.values()).sort((d,p)=>p.score-d.score).slice(0,e).map(({result:d,score:p})=>({...d,rank:-p}))}#$(t,e){let n=e.toLowerCase().split(/\s+/).filter(i=>i.length>=2),r=n.filter(i=>!O.has(i)),o=r.length>0?r:n;return t.map(i=>{let a=i.title.toLowerCase(),u=o.filter(p=>a.includes(p)).length,c=i.contentType==="code"?.6:.3,l=u>0?c*(u/o.length):0,h=0,d=0;if(o.length>=2){let p=i.content.toLowerCase(),f=o.map(g=>se(p,g));if(!f.some(g=>g.length===0)){h=1/(1+oe(f)/Math.max(p.length,1));let E=ie(f,o);d=.5*Math.min(1,E/4)}}return{result:i,boost:l+h+d}}).sort((i,a)=>a.boost-i.boost||i.result.rank-a.result.rank).map(({result:i})=>i)}searchWithFallback(t,e=3,n,r,o="like"){this.#X();let i=this.#U(t,e,n,r,o);if(i.length>0)return this.#$(i,t).map(d=>({...d,matchLayer:"rrf"}));let a=t.toLowerCase().trim().split(/\s+/).filter(h=>h.length>=3&&!O.has(h)),u=a.join(" "),l=a.map(h=>this.fuzzyCorrect(h)??h).join(" ");if(l!==u){let h=this.#U(l,e,n,r,o);if(h.length>0)return this.#$(h,l).map(p=>({...p,matchLayer:"rrf-fuzzy"}))}return[]}lastRefreshCount=0;#X(){this.lastRefreshCount=0;let t=this.#t.prepare("SELECT label, file_path, content_hash, indexed_at FROM sources WHERE file_path IS NOT NULL").all();for(let e of t)try{if(!Jt(e.file_path)||this.#i&&this.#i(e.file_path))continue;let n=it(e.file_path).mtime,r=new Date(e.indexed_at+"Z");if(n<=r)continue;let o=ot(e.file_path,"r"),i;try{if(!at(o).isFile())continue;i=st(o,"utf-8")}finally{ct(o)}if(ut("sha256").update(i).digest("hex")===e.content_hash)continue;this.index({content:i,path:e.file_path,source:e.label}),this.lastRefreshCount++}catch{}}getSourceMeta(t){let e=this.#O.get(t);return e?{label:e.label,chunkCount:e.chunk_count,codeChunkCount:e.code_chunk_count,indexedAt:e.indexed_at,filePath:e.file_path??null,contentHash:e.content_hash??null}:null}listSources(){return this.#D.all()}getChunksBySource(t){return this.#N.all(t).map(n=>({title:n.title,content:n.content,source:n.label,rank:0,contentType:n.content_type}))}getDistinctiveTerms(t,e=40){let n=this.#w.get(t);if(!n||n.chunk_count<3)return[];let r=n.chunk_count,o=2,i=Math.max(3,Math.ceil(r*.4)),a=new Map;for(let l of this.#C.iterate(t)){let h=new Set(l.content.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(d=>d.length>=3&&!O.has(d)));for(let d of h)a.set(d,(a.get(d)??0)+1)}return Array.from(a.entries()).filter(([,l])=>l>=o&&l<=i).map(([l,h])=>{let d=Math.log(r/h),p=Math.min(l.length/20,.5),f=/[_]/.test(l),g=l.length>=12,E=f?1.5:g?.8:0;return{word:l,score:d+p+E}}).sort((l,h)=>h.score-l.score).slice(0,e).map(l=>l.word)}getStats(){let t=this.#L.get();return{sources:t?.sources??0,chunks:t?.chunks??0,codeChunks:t?.codeChunks??0}}cleanupStaleSources(t){return this.#t.transaction(r=>(this.#I.run(r),this.#A.run(r),this.#F.run(r)))(t).changes}getDBSizeBytes(){try{return it(this.#n).size}catch{return 0}}#B(){try{this.#t.exec("INSERT INTO chunks(chunks) VALUES('optimize')"),this.#t.exec("INSERT INTO chunks_trigram(chunks_trigram) VALUES('optimize')")}catch{}}close(){this.#B(),H(this.#t)}#V(t){let e=t.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(o=>o.length>=3&&!O.has(o)),n=[...new Set(e)],r=0;this.#t.transaction(()=>{for(let o of n){let i=this.#l.run(o);r+=i.changes}})(),r>0&&this.#e.clear()}#Y(t,e=lt){let n=[],r=t.split(`
`),o=[],i=[],a="",u=()=>{let l=i.join(`
`).trim();if(l.length===0)return;let h=this.#J(o,a),d=i.some(m=>/^`{3,}/.test(m));if(Buffer.byteLength(l)<=e){n.push({title:h,content:l,hasCode:d}),i=[];return}let p=l.split(/\n\n+/),f=[],g=1,E=()=>{if(f.length===0)return;let m=f.join(`

`).trim();if(m.length===0)return;let S=p.length>1?`${h} (${g})`:h;g++,n.push({title:S,content:m,hasCode:m.includes("```")}),f=[]};for(let m of p){f.push(m);let S=f.join(`

`);Buffer.byteLength(S)>e&&f.length>1&&(f.pop(),E(),f=[m])}E(),i=[]},c=0;for(;c<r.length;){let l=r[c];if(/^[-_*]{3,}\s*$/.test(l)){u(),c++;continue}let h=l.match(/^(#{1,4})\s+(.+)$/);if(h){u();let p=h[1].length,f=h[2].trim();for(;o.length>0&&o[o.length-1].level>=p;)o.pop();o.push({level:p,text:f}),a=f,i.push(l),c++;continue}let d=l.match(/^(`{3,})(.*)?$/);if(d){let p=d[1],f=[l];for(c++;c<r.length;){if(f.push(r[c]),r[c].startsWith(p)&&r[c].trim()===p){c++;break}c++}i.push(...f);continue}i.push(l),c++}return u(),n}#G(t,e){let n=t.split(/\n\s*\n/);if(n.length>=3&&n.length<=200&&n.every(u=>Buffer.byteLength(u)<5e3))return n.map((u,c)=>{let l=u.trim();return{title:l.split(`
`)[0].slice(0,80)||`Section ${c+1}`,content:l}}).filter(u=>u.content.length>0);let r=t.split(`
`);if(r.length<=e)return[{title:"Output",content:t}];let o=[],a=Math.max(e-2,1);for(let u=0;u<r.length;u+=a){let c=r.slice(u,u+e);if(c.length===0)break;let l=u+1,h=Math.min(u+c.length,r.length),d=c[0]?.trim().slice(0,80);o.push({title:d||`Lines ${l}-${h}`,content:c.join(`
`)})}return o}#j(t,e,n,r){let o=e.length>0?e.join(" > "):"(root)",i=JSON.stringify(t,null,2);if(Buffer.byteLength(i)<=r&&!(typeof t=="object"&&t!==null&&!Array.isArray(t)&&Object.values(t).some(u=>typeof u=="object"&&u!==null))){n.push({title:o,content:i,hasCode:!0});return}if(typeof t=="object"&&t!==null&&!Array.isArray(t)){let a=Object.entries(t);if(a.length>0){for(let[u,c]of a)this.#j(c,[...e,u],n,r);return}n.push({title:o,content:i,hasCode:!0});return}if(Array.isArray(t)){this.#K(t,e,n,r);return}n.push({title:o,content:i,hasCode:!1})}#z(t){if(t.length===0)return null;let e=t[0];if(typeof e!="object"||e===null||Array.isArray(e))return null;let n=["id","name","title","path","slug","key","label"],r=e;for(let o of n)if(o in r&&(typeof r[o]=="string"||typeof r[o]=="number"))return o;return null}#q(t,e,n,r,o){let i=t?`${t} > `:"";if(!o)return e===n?`${i}[${e}]`:`${i}[${e}-${n}]`;let a=u=>String(u[o]);return r.length===1?`${i}${a(r[0])}`:r.length<=3?i+r.map(a).join(", "):`${i}${a(r[0])}\u2026${a(r[r.length-1])}`}#K(t,e,n,r){let o=e.length>0?e.join(" > "):"(root)",i=this.#z(t),a=[],u=0,c=l=>{if(a.length===0)return;let h=this.#q(o,u,l,a,i);n.push({title:h,content:JSON.stringify(a,null,2),hasCode:!0})};for(let l=0;l<t.length;l++){a.push(t[l]);let h=JSON.stringify(a,null,2);Buffer.byteLength(h)>r&&a.length>1&&(a.pop(),c(l-1),a=[t[l]],u=l)}c(u+a.length-1)}#J(t,e){return t.length===0?e||"Untitled":t.map(n=>n.text).join(" > ")}};import{createHash as mt}from"node:crypto";import{accessSync as an,constants as cn,existsSync as ht,mkdirSync as un,realpathSync as ln,renameSync as gt}from"node:fs";import{dirname as hn,isAbsolute as gn,join as pt,resolve as pn}from"node:path";function ft(s){let t=s.replace(/\\/g,"/");return/^\/+$/.test(t)?"/":/^[A-Za-z]:\/+$/.test(t)?`${t.slice(0,2)}/`:t.replace(/\/+$/,"")}function ae(s){return mt("sha256").update(ft(s)).digest("hex").slice(0,16)}function ce(s){let t=ft(s),e=process.platform==="darwin"||process.platform==="win32"?t.toLowerCase():t;return mt("sha256").update(e).digest("hex").slice(0,16)}function Et(s){let{projectDir:t,contentDir:e}=s,n=ce(t),r=pt(e,`${n}.db`);if(ht(r))return r;let o=ae(t);if(o===n)return r;let i=pt(e,`${o}.db`);if(ht(i))try{gt(i,r);for(let a of["-wal","-shm"])try{gt(i+a,r+a)}catch{}}catch{}return r}function bt(s){let t=P(s);for(;;){let e=X(t,".claude","context-mode.json");try{let r=yt(e,"utf-8");return{config:JSON.parse(r),configPath:e}}catch{}let n=he(t);if(n===t)break;t=n}return null}function pe(s,t){let e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`).test(s)}function V(s,t,e){let n=[];try{let r=ue(s);for(let o of r){let i=X(s,o);try{let a=_t(i);a.isDirectory()&&e?n.push(...V(i,t,!0)):a.isFile()&&pe(o,t)&&n.push(i)}catch{}}}catch{}return n}function F(s,t){try{let e=yt(s,"utf-8");return e.trim().length===0?null:{name:t?ge(t,s):St(s),path:s,content:e}}catch{return null}}function me(s){if(s.paths){let t=s.path||".";return s.paths.map(e=>P(t,e)).map(e=>F(e,t)).filter(e=>e!==null)}if(s.exec){let t=s.path||process.cwd();try{let e=de(s.exec,{cwd:t,encoding:"utf-8",timeout:1e4}).trim(),n=JSON.parse(e);return Array.isArray(n)?n.map(r=>P(t,r)).map(r=>F(r,t)).filter(r=>r!==null):(process.stderr.write(`[context-wrapper] exec for "${s.label}" did not return an array
`),[])}catch(e){return process.stderr.write(`[context-wrapper] exec for "${s.label}" failed: ${e.message}
`),[]}}return s.glob&&s.path?V(s.path,s.glob,!!s.recursive).map(t=>F(t,s.path)).filter(t=>t!==null):(process.stderr.write(`[context-wrapper] source "${s.label}" has no file selection strategy (need glob+path, exec, or paths)
`),[])}function fe(s){if(!s.startsWith("---"))return s;let t=s.indexOf(`
---`,3);return t===-1?s:s.slice(t+4).replace(/^\n+/,"")}function Ee(s,t){let e=t.match(/^(\d{4}-\d{2}-\d{2})\.md$/);if(!e)return s;let n=e[1],r=s.split(`
`),o=[];for(let i of r){if(/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(i))continue;let a=i.match(/^(##\s+)(.+)$/);a?o.push(`${a[1]}[${n}] ${a[2]}`):o.push(i)}return o.join(`
`)}function ye(s){return s.replace(/\n{3,}/g,`

`)}function Tt(s,t,e){let n=s;return e?.stripFrontmatter&&(n=fe(n)),e?.prefixDates&&(n=Ee(n,t)),ye(n)}function _e(s,t){return Tt(s.content,s.name,{stripFrontmatter:t.stripFrontmatter,prefixDates:t.prefixDates})}function Se(s,t){let e=X(s,"content");return le(e,{recursive:!0}),Et({projectDir:P(t),contentDir:e})}function Rt(s){let t=P(s.path),e=_t(t),n=String(s.source??St(t));if(e.isDirectory()){let o=s.glob??"*.md",i=s.recursive!==!1,a=V(t,o,i).map(u=>F(u,t)).filter(u=>u!==null);return{basePath:t,isDirectory:!0,files:a,sourcePrefix:n}}let r=F(t);return{basePath:t,isDirectory:!1,files:r?[r]:[],sourcePrefix:n}}function kt(s,t){let e=t?.stripFrontmatter!==!1,n=t?.prefixDates===!0;return s.map(r=>({file:r,content:Tt(r.content,r.name,{stripFrontmatter:e,prefixDates:n})})).filter(r=>r.content.trim().length>0).map(r=>({...r,source:r.file.name}))}function xt(s,t,e){let n=Se(t,e),r=new M(n),o=0,i=0;for(let a of s.sources){let u=me(a);if(u.length!==0)for(let c of u){let l=_e(c,a);if(l.trim().length===0)continue;let h=`${a.label}: ${c.name}`,d=r.index({content:l,source:h});o++,i+=d.totalChunks}}return r.close(),{totalSources:o,totalChunks:i,dbPath:n}}var wt={execute:"ctx_execute",index:"ctx_index",search:"ctx_search",fetch_and_index:"ctx_fetch_and_index",batch_execute:"ctx_batch_execute"},Nt=new Map(Object.entries(wt).map(([s,t])=>[t,s])),Ie=new Set(["ctx_stats","ctx_doctor","ctx_upgrade","ctx_purge","ctx_insight"]),U={execute:"Run code in the upstream sandbox. Use for derivation over files, command output, or fetched data without dumping raw bytes into context. When `path` is provided, the file is exposed inside the sandbox as FILE_CONTENT.",search:"Search indexed content with BM25/FTS5 ranking. Use after prewarm, index, fetch_and_index, batch_execute, or batch_read. Scope with `source` when you want results from a specific label or batch.",fetch_and_index:"Fetch one or more URLs, convert/index the content, and make it searchable. Use when the source is remote and you want retrieval via `search` instead of pasting raw page content into context.",batch_execute:"Run multiple shell commands, index their outputs, and optionally query the results in the same call. Use for multi-step collection where raw command output should converge into searchable indexed content."},Ae=new Set(["apps","packages","src","lib"]);function Fe(s){let t=s.split("/").filter(Boolean),e=-1;for(let r=t.length-1;r>=0;r--)if(Ae.has(t[r])){e=r;break}let n=e>=0?t.slice(e+1):t.slice(-2);return n=n.filter(r=>r!=="src"),n.join("/")}function Pe(s){let t=new Map;return s.map(e=>{let n=(t.get(e)??0)+1;return t.set(e,n),n>1?`${e} (${n})`:e})}function Me(s){let e=(s?.content?.[0]?.text??"").match(/^Indexed (\d+) sections/);return e?parseInt(e[1],10):0}async function Ue(){let s=process.cwd(),t=bt(s),e=Te(vt(be(),"context-mode-")),n=Dt(ve(import.meta.url)),r=n.endsWith("/src")?Dt(n):n,o=vt(r,"node_modules","context-mode","server.bundle.mjs"),i=new Ce({command:"node",args:[o],cwd:s,env:{...process.env,CONTEXT_MODE_DIR:e,CONTEXT_MODE_PROJECT_DIR:s,CLAUDE_PROJECT_DIR:s,PWD:s},stderr:"inherit"}),a=new we({name:"context-wrapper",version:"0.2.0"});await a.connect(i);let u=i.pid;if(!u)throw new Error("Failed to get upstream server PID");if(process.stderr.write(`[context-wrapper] Connected to upstream server (pid ${u})
`),t){let g=performance.now(),E=xt(t.config,e,s),m=(performance.now()-g).toFixed(0);process.stderr.write(`[context-wrapper] Pre-warmed ${E.totalChunks} chunks from ${E.totalSources} files in ${m}ms (${E.dbPath})
`)}let{tools:c}=await a.listTools(),l=c.find(g=>g.name==="ctx_execute_file"),h=c.filter(g=>!Ie.has(g.name)).filter(g=>g.name!=="ctx_execute_file").filter(g=>Nt.has(g.name)).map(g=>{let E=Nt.get(g.name);if(E==="execute"&&l){let m={...g.inputSchema.properties??{}};return l.inputSchema.properties?.path?m.path=l.inputSchema.properties.path:m.path={type:"string",description:"Absolute file path or relative to project root. When provided, reads this file into a FILE_CONTENT variable inside the sandbox \u2014 file contents stay in sandbox, only your printed output enters context."},{...g,name:E,description:U.execute,inputSchema:{...g.inputSchema,properties:m}}}return E==="index"?{...g,name:E,description:"Store content in the searchable BM25 knowledge base. When `content` is provided, it is indexed directly. When `path` is provided, the wrapper reads files relative to the agent cwd, applies markdown preprocessing, and indexes each file as its own source.",inputSchema:{type:"object",properties:{content:{type:"string",description:"Raw text/markdown to index. Provide this OR path, not both."},path:{type:"string",description:"File or directory path to index. Relative paths resolve from the current working directory/worktree."},source:{type:"string",description:'Source label. For directories, each file gets "{source}: {relative/path}". Defaults to the directory basename or resolved file path.'},glob:{type:"string",description:'Directory-only filename pattern. Defaults to "*.md".'},recursive:{type:"boolean",description:"Directory-only recursive walk flag. Defaults to true."},stripFrontmatter:{type:"boolean",description:"Path-based indexing only. Strip YAML frontmatter before indexing. Defaults to true."},prefixDates:{type:"boolean",description:"Path-based indexing only. For YYYY-MM-DD.md files, prefix ## headings with [date]. Defaults to false."}}}}:E==="search"?{...g,name:E,description:U.search}:E==="fetch_and_index"?{...g,name:E,description:U.fetch_and_index}:E==="batch_execute"?{...g,name:E,description:U.batch_execute}:{...g,name:E}});h.push({name:"batch_read",description:"Read multiple files, index them, and search across their contents. Use instead of batch_execute when all inputs are known file paths (no shell commands needed). Labels are auto-derived from file paths. Returns BM25 search results plus a batch ID \u2014 pass the batch ID as `source` to `search` for follow-up questions scoped to exactly these files.",inputSchema:{type:"object",properties:{files:{type:"array",items:{type:"string"},description:"File paths to read and index. Absolute paths preferred; relative paths resolve from the current working directory.",minItems:1},queries:{type:"array",items:{type:"string"},description:"Search queries to run against the indexed content. Use 5\u20138 comprehensive queries. Each returns top matching sections.",minItems:1}},required:["files","queries"],additionalProperties:!1}});let d=new De({name:"context-wrapper",version:"0.2.0"},{capabilities:{tools:{}}});d.setRequestHandler(Le,async()=>({tools:h})),d.setRequestHandler(Oe,async g=>{let{name:E,arguments:m}=g.params;if(E==="index"&&m?.path!==void 0){let b=Y(s,String(m.path)),_;try{_=Rt({path:b,source:typeof m.source=="string"?m.source:void 0,glob:typeof m.glob=="string"?m.glob:void 0,recursive:typeof m.recursive=="boolean"?m.recursive:void 0,stripFrontmatter:typeof m.stripFrontmatter=="boolean"?m.stripFrontmatter:void 0,prefixDates:typeof m.prefixDates=="boolean"?m.prefixDates:void 0})}catch(D){return{content:[{type:"text",text:`Index error: ${D.message}`}],isError:!0}}if(_.files.length===0)return{content:[{type:"text",text:_.isDirectory?`No files matched in ${_.basePath}.`:`Nothing indexable found at ${_.basePath}.`}]};let y=kt(_.files,{stripFrontmatter:typeof m.stripFrontmatter=="boolean"?m.stripFrontmatter:void 0,prefixDates:typeof m.prefixDates=="boolean"?m.prefixDates:void 0}),T=0,v=0,R=[];for(let D of y){let k=_.isDirectory?`${_.sourcePrefix}: ${D.source}`:String(m.source??_.basePath);try{let N=await a.callTool({name:"ctx_index",arguments:{content:D.content,source:k}});v+=Me(N),T++}catch(N){R.push(`${D.file.name}: ${N.message}`)}}let w=_.isDirectory?`Indexed ${T} file${T===1?"":"s"} (${v} chunks) from ${_.basePath}`:`Indexed ${v} sections from: ${String(m.source??_.basePath)}`;return{content:[{type:"text",text:R.length>0?`${w}

Errors (${R.length}):
${R.join(`
`)}`:w}],isError:R.length>0&&T===0}}if(E==="batch_read"){let{files:b,queries:_}=m,y=xe(3).toString("hex"),T=b.map(x=>Fe(Y(s,x))),v=Pe(T),R=[];for(let x=0;x<b.length;x++){let G=Y(s,b[x]),Ct=`${y}/${v[x]}`,z;try{z=Re(G,"utf-8")}catch{R.push(G);continue}await a.callTool({name:"ctx_index",arguments:{content:z,source:Ct}})}let D=(await a.callTool({name:"ctx_search",arguments:{queries:_,source:y,limit:3}})).content?.[0]?.text??"(no results)",k=R.length>0?`

\u26A0 Could not read ${R.length} file(s):
${R.map(x=>`  - ${x}`).join(`
`)}`:"",N=`

---
**Batch ID:** \`${y}\`
To search only these files: \`search(queries: [...], source: "${y}")\``;return{content:[{type:"text",text:D+k+N}]}}let S;if(E==="execute"&&m?.path!==void 0?S="ctx_execute_file":S=wt[E],!S)return{content:[{type:"text",text:`Unknown tool: ${E}`}],isError:!0};let I=await a.callTool({name:S,arguments:m});if(E==="search"&&t?.config.searchReminder!==void 0){let b=t.config.searchReminder,_=I.content;if(Array.isArray(_))for(let y of _){if(y.type!=="text"||typeof y.text!="string")continue;let T=/\n\n⚠ search call #\d+\/\d+ in this window\..+$/s,v=/^BLOCKED: \d+ search calls in \d+s\..+$/s;T.test(y.text)?y.text=b===!1?y.text.replace(T,""):y.text.replace(T,`

${b}`):v.test(y.text)&&(y.text=b===!1?"":String(b))}}return I});let p=new Ne;await d.connect(p),process.stderr.write(`[context-wrapper] MCP server ready (${h.length} tools) [tmp=${e}]
`);let f=async()=>{await Promise.allSettled([a.close(),d.close()])};process.stdin.on("end",()=>process.exit(0)),process.on("SIGINT",async()=>{await f(),process.exit(0)}),process.on("SIGTERM",async()=>{await f(),process.exit(0)}),process.on("exit",()=>{try{process.kill(u)}catch{}try{ke(e,{recursive:!0,force:!0})}catch{}})}Ue().catch(s=>{process.stderr.write(`[context-wrapper] Fatal: ${s.message}
${s.stack}
`),process.exit(1)});
