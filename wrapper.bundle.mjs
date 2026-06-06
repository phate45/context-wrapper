import{join as Nt,dirname as Ct,resolve as Y}from"node:path";import{tmpdir as xe}from"node:os";import{mkdtempSync as ke,readFileSync as De,rmSync as ve}from"node:fs";import{randomBytes as Ne}from"node:crypto";import{fileURLToPath as Ce}from"node:url";import{Server as Le}from"@modelcontextprotocol/sdk/server/index.js";import{StdioServerTransport as Oe}from"@modelcontextprotocol/sdk/server/stdio.js";import{Client as Ae}from"@modelcontextprotocol/sdk/client/index.js";import{StdioClientTransport as we}from"@modelcontextprotocol/sdk/client/stdio.js";import{ListToolsRequestSchema as Ie,CallToolRequestSchema as Fe}from"@modelcontextprotocol/sdk/types.js";import{readFileSync as _t,readdirSync as de,statSync as St,mkdirSync as he}from"node:fs";import{execSync as ge}from"node:child_process";import{join as X,dirname as pe,basename as yt,resolve as M,relative as me}from"node:path";import{createRequire as wt}from"node:module";import{existsSync as It,unlinkSync as z,renameSync as Xe}from"node:fs";var $=class{#t;constructor(t){this.#t=t}pragma(t){let n=this.#t.prepare(`PRAGMA ${t}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let r=Object.values(n[0]);return r.length===1?r[0]:n[0]}exec(t){let e="",n=null;for(let o=0;o<t.length;o++){let i=t[o];if(n)e+=i,i===n&&(n=null);else if(i==="'"||i==='"')e+=i,n=i;else if(i===";"){let a=e.trim();a&&this.#t.prepare(a).run(),e=""}else e+=i}let r=e.trim();return r&&this.#t.prepare(r).run(),this}prepare(t){let e=this.#t.prepare(t);return{run:(...n)=>e.run(...n),get:(...n)=>{let r=e.get(...n);return r===null?void 0:r},all:(...n)=>e.all(...n),iterate:(...n)=>e.iterate(...n)}}transaction(t){return this.#t.transaction(t)}close(){this.#t.close()}},B=class{#t;constructor(t){this.#t=t}pragma(t){let n=this.#t.prepare(`PRAGMA ${t}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let r=Object.values(n[0]);return r.length===1?r[0]:n[0]}exec(t){return this.#t.exec(t),this}prepare(t){let e=this.#t.prepare(t);return{run:(...n)=>e.run(...n),get:(...n)=>e.get(...n),all:(...n)=>e.all(...n),iterate:(...n)=>typeof e.iterate=="function"?e.iterate(...n):e.all(...n)[Symbol.iterator]()}}transaction(t){return(...e)=>{this.#t.exec("BEGIN");try{let n=t(...e);return this.#t.exec("COMMIT"),n}catch(n){throw this.#t.exec("ROLLBACK"),n}}}close(){this.#t.close()}},O=null;function Ft(s){let t=null;try{return t=new s(":memory:"),t.exec("CREATE VIRTUAL TABLE __fts5_probe USING fts5(x)"),!0}catch{return!1}finally{try{t?.close()}catch{}}}function Mt(s,t){let e=t!==void 0?t:globalThis.Bun;if(typeof e<"u"&&e!==null)return!0;let n=s??process.versions,[r,o]=(n.node??"0.0.0").split("."),i=Number(r),a=Number(o);return!Number.isFinite(i)||!Number.isFinite(a)?!1:i>22||i===22&&a>=5}function K(){if(!O){let s=wt(import.meta.url);if(globalThis.Bun){let t=s(["bun","sqlite"].join(":")).Database;O=function(n,r){let o=new t(n,{readonly:r?.readonly,create:!0}),i=new $(o);return r?.timeout&&i.pragma(`busy_timeout = ${r.timeout}`),i}}else if(Mt()){let t=null;try{({DatabaseSync:t}=s(["node","sqlite"].join(":")))}catch{t=null}t&&Ft(t)?O=function(n,r){let o=new t(n,{readOnly:r?.readonly??!1}),i=new B(o);return r?.timeout&&i.pragma(`busy_timeout = ${r.timeout}`),i}:O=s("better-sqlite3")}else O=s("better-sqlite3")}return O}function j(s){s.pragma("journal_mode = WAL"),s.pragma("synchronous = NORMAL");try{s.pragma("mmap_size = 268435456")}catch{}}function H(s){if(!It(s))for(let t of["-wal","-shm"])try{z(s+t)}catch{}}function J(s){for(let t of["","-wal","-shm"])try{z(s+t)}catch{}}function W(s){try{s.pragma("wal_checkpoint(TRUNCATE)")}catch{}try{s.close()}catch{}}function A(s,t=[100,500,2e3]){let e;for(let n=0;n<=t.length;n++)try{return s()}catch(r){let o=r instanceof Error?r.message:String(r);if(!o.includes("SQLITE_BUSY")&&!o.includes("database is locked"))throw r;if(e=r instanceof Error?r:new Error(o),n<t.length){let i=t[n],a=Date.now();for(;Date.now()-a<i;);}}throw new Error(`SQLITE_BUSY: database is locked after ${t.length} retries. Original error: ${e?.message}`)}function Q(s){return s.includes("SQLITE_CORRUPT")||s.includes("SQLITE_NOTADB")||s.includes("database disk image is malformed")||s.includes("file is not a database")}var I=Symbol.for("__context_mode_live_dbs_v3__"),Ve=(()=>{let s=globalThis;return s[I]||(s[I]=new Set,process.on("exit",()=>{for(let t of s[I])W(t);s[I].clear()})),s[I]})();import{readFileSync as st,readdirSync as Qe,unlinkSync as Qt,existsSync as Zt,statSync as it,openSync as ot,fstatSync as at,closeSync as ct}from"node:fs";import{createHash as ut}from"node:crypto";import{tmpdir as te}from"node:os";import{join as ee}from"node:path";import{readdirSync as Pt,statSync as Ut,lstatSync as $t,realpathSync as Z,existsSync as Bt,readFileSync as jt}from"node:fs";import{join as et,extname as Ht,relative as nt,sep as Wt,resolve as Xt}from"node:path";var Vt=["node_modules",".git","dist","build",".next","coverage",".venv","__pycache__",".DS_Store"],Yt=[".md",".mdx",".txt",".json",".yaml",".yml",".ts",".tsx",".js",".jsx",".py",".rs",".go",".sh"],qt=5,Gt=200;function zt(s){let t="";for(let e=0;e<s.length;e++){let n=s[e];n==="*"?s[e+1]==="*"?(t+=".*",e++):t+="[^/]*":n==="?"?t+="[^/]":"\\^$.|+()[]{}".includes(n)?t+="\\"+n:t+=n}return new RegExp(`^${t}$`)}function tt(s,t){if(t.length===0)return!1;let e=s.split("/").pop()??s;for(let n of t){if(!n.includes("/")&&!n.includes("*")){if(e===n||s.split("/").includes(n))return!0;continue}let r=zt(n);if(r.test(s)||r.test(e))return!0}return!1}function Kt(s){let t=et(s,".gitignore");if(!Bt(t))return[];try{return jt(t,"utf-8").split(/\r?\n/).map(n=>n.trim()).filter(n=>n.length>0&&!n.startsWith("#")&&!n.startsWith("!")).map(n=>n.replace(/^\//,"").replace(/\/$/,""))}catch{return[]}}function Jt(s,t){return nt(s,t).split(Wt).join("/")}function rt(s,t={}){let{include:e,exclude:n,maxDepth:r=qt,maxFiles:o=Gt,extensions:i,respectGitignore:a=!0,followSymlinks:u=!1}=t,c;try{c=Z(s)}catch{return{files:[],capped:!1,totalSeen:0}}let l=(i&&i.length>0?i:Yt).map(S=>(S.startsWith(".")?S:"."+S).toLowerCase()),g=[...Vt,...n??[],...a?Kt(c):[]],h=e??[],E=[],m=new Set([c]),d=0,p=!1;function f(S,C){if(p||C>r)return;let v;try{v=Pt(S,{withFileTypes:!0})}catch{return}for(let _ of v){if(p)return;let y=et(S,_.name),x=Jt(c,y);if(tt(x,g))continue;let N=_.isDirectory(),b=_.isFile(),L=!1;try{L=$t(y).isSymbolicLink()}catch{continue}if(L){if(!u)continue;let T;try{T=Z(y)}catch{continue}let D=nt(c,T);if((D.startsWith("..")||Xt(D)===T)&&D.startsWith("..")||m.has(T))continue;m.add(T);try{let R=Ut(T);N=R.isDirectory(),b=R.isFile()}catch{continue}}if(N){f(y,C+1);continue}if(!b)continue;let k=Ht(y).toLowerCase();if(l.includes(k)&&!(h.length>0&&!tt(x,h))){if(d++,E.length>=o){p=!0;return}E.push(y)}}}return f(c,0),{files:E,capped:p,totalSeen:d}}var w=new Set(["the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","has","his","how","its","may","new","now","old","see","way","who","did","get","got","let","say","she","too","use","will","with","this","that","from","they","been","have","many","some","them","than","each","make","like","just","over","such","take","into","year","your","good","could","would","about","which","their","there","other","after","should","through","also","more","most","only","very","when","what","then","these","those","being","does","done","both","same","still","while","where","here","were","much","update","updates","updated","deps","dev","tests","test","add","added","fix","fixed","run","running","using"]);function dt(s){let t=new Set,e=[];for(let n of s){let r=n.toLowerCase();t.has(r)||(t.add(r),e.push(n))}return e}function ne(s,t="AND"){let e=dt(s.replace(/['"(){}[\]*:^~]/g," ").split(/\s+/).filter(o=>o.length>0&&!["AND","OR","NOT","NEAR"].includes(o.toUpperCase())));if(e.length===0)return'""';let n=e.filter(o=>!w.has(o.toLowerCase()));return(n.length>0?n:e).map(o=>`"${o}"`).join(t==="OR"?" OR ":" ")}function re(s,t="AND"){let e=s.replace(/["'(){}[\]*:^~]/g,"").trim();if(e.length<3)return"";let n=dt(e.split(/\s+/).filter(i=>i.length>=3));if(n.length===0)return"";let r=n.filter(i=>!w.has(i.toLowerCase()));return(r.length>0?r:n).map(i=>`"${i}"`).join(t==="OR"?" OR ":" ")}function se(s,t){if(s.length===0)return t.length;if(t.length===0)return s.length;let e=Array.from({length:t.length+1},(n,r)=>r);for(let n=1;n<=s.length;n++){let r=[n];for(let o=1;o<=t.length;o++)r[o]=s[n-1]===t[o-1]?e[o-1]:1+Math.min(e[o],r[o-1],e[o-1]);e=r}return e[t.length]}function ie(s){return s<=4?1:s<=12?2:3}var lt=4096;function oe(s,t){let e=[],n=s.indexOf(t);for(;n!==-1;)e.push(n),n=s.indexOf(t,n+1);return e}function ae(s,t,e=30){if(s.length<2||t.length<2)return 0;let n=0,r=Math.min(s.length,t.length)-1;for(let o=0;o<r;o++){let i=s[o],a=s[o+1],u=t[o].length,c=0;for(let l of i){let g=l+u,h=g+e;for(;c<a.length&&a[c]<g;)c++;c<a.length&&a[c]<=h&&(n++,c++)}}return n}function ce(s){if(s.length===0)return 1/0;if(s.length===1)return 0;let t=s,e=new Array(t.length).fill(0),n=1/0;for(;;){let r=1/0,o=-1/0,i=0;for(let u=0;u<t.length;u++){let c=t[u][e[u]];c<r&&(r=c,i=u),c>o&&(o=c)}let a=o-r;if(a<n&&(n=a),e[i]++,e[i]>=t[i].length)break}return n}var P=class s{#t;#n;#i;#o;#a;#c;#u;#l;#d;#h;#g;#p;#m;#f;#E;#_;#S;#y;#b;#T;#R;#x;#k;#D;#v;#N;#C;#L;#O;#A;#w;#I;#F;#M=0;static OPTIMIZE_EVERY=50;#e=new Map;static FUZZY_CACHE_SIZE=256;constructor(t){let e=K();this.#n=t??ee(te(),`context-mode-${process.pid}.db`),H(this.#n);let n;try{n=new e(this.#n,{timeout:3e4}),j(n)}catch(r){let o=r instanceof Error?r.message:String(r);if(Q(o)){J(this.#n),H(this.#n);try{n=new e(this.#n,{timeout:3e4}),j(n)}catch(i){throw new Error(`Failed to create fresh DB after deleting corrupt file: ${i instanceof Error?i.message:String(i)}`)}}else throw r}this.#t=n,this.#H(),this.#W()}cleanup(){try{this.#t.close()}catch{}for(let t of["","-wal","-shm"])try{Qt(this.#n+t)}catch{}}#H(){this.#t.exec(`
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
        `))}catch{}try{this.#t.exec("ALTER TABLE sources ADD COLUMN file_path TEXT")}catch{}try{this.#t.exec("ALTER TABLE sources ADD COLUMN content_hash TEXT")}catch{}}#W(){this.#o=this.#t.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count, file_path, content_hash) VALUES (?, 0, 0, ?, ?)"),this.#a=this.#t.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count, file_path, content_hash) VALUES (?, ?, ?, ?, ?)"),this.#c=this.#t.prepare("INSERT INTO chunks (title, content, source_id, content_type, source_category, session_id, event_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"),this.#u=this.#t.prepare("INSERT INTO chunks_trigram (title, content, source_id, content_type, source_category, session_id, event_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"),this.#l=this.#t.prepare("INSERT OR IGNORE INTO vocabulary (word) VALUES (?)"),this.#d=this.#t.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#h=this.#t.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#g=this.#t.prepare("DELETE FROM sources WHERE label = ?"),this.#p=this.#t.prepare(`
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
    `),this.#m=this.#t.prepare(`
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
    `),this.#f=this.#t.prepare(`
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
    `),this.#E=this.#t.prepare(`
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
    `),this.#_=this.#t.prepare(`
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
    `),this.#S=this.#t.prepare(`
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
    `),this.#b=this.#t.prepare(`
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
    `),this.#T=this.#t.prepare(`
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
    `),this.#R=this.#t.prepare(`
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
    `),this.#x=this.#t.prepare(`
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
    `),this.#k=this.#t.prepare(`
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
    `),this.#D=this.#t.prepare(`
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
    `),this.#y=this.#t.prepare("SELECT word FROM vocabulary WHERE length(word) BETWEEN ? AND ?"),this.#v=this.#t.prepare("SELECT label, chunk_count as chunkCount FROM sources ORDER BY id DESC"),this.#N=this.#t.prepare(`SELECT c.title, c.content, c.content_type, s.label
       FROM chunks c
       JOIN sources s ON s.id = c.source_id
       WHERE c.source_id = ?
       ORDER BY c.rowid`),this.#C=this.#t.prepare("SELECT chunk_count FROM sources WHERE id = ?"),this.#L=this.#t.prepare("SELECT content FROM chunks WHERE source_id = ?"),this.#A=this.#t.prepare("SELECT label, chunk_count, code_chunk_count, indexed_at, file_path, content_hash FROM sources WHERE label = ?"),this.#O=this.#t.prepare(`
      SELECT
        (SELECT COUNT(*) FROM sources) AS sources,
        (SELECT COUNT(*) FROM chunks) AS chunks,
        (SELECT COUNT(*) FROM chunks WHERE content_type = 'code') AS codeChunks
    `),this.#w=this.#t.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days'))"),this.#I=this.#t.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days'))"),this.#F=this.#t.prepare("DELETE FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days')")}setDenyChecker(t){this.#i=t}index(t){let{content:e,path:n,source:r,attribution:o}=t,i=typeof e=="string"&&e.length>0;if(!i&&!n)throw new Error("Either content or path must be provided");let a;if(i)a=e;else{let h=ot(n,"r");try{if(!at(h).isFile())throw new Error(`refusing to index ${n}: not a regular file`);a=st(h,"utf-8")}finally{ct(h)}}let u=r??n??"untitled",c=this.#q(a),l=n??void 0,g=l?ut("sha256").update(a).digest("hex"):void 0;return A(()=>this.#r(c,u,a,l,g,o))}indexDirectory(t){let{path:e,source:n,attribution:r,perFileDeny:o,...i}=t,a=rt(e,i),u=0,c=0,l=0,g=0;for(let h of a.files){if(o&&o(h)){l++;continue}try{let E=n?`${n}:${h}`:h,m=this.index({path:h,source:E,attribution:r});u++,c+=m.totalChunks}catch{g++}}return{filesIndexed:u,totalChunks:c,capped:a.capped,totalSeen:a.totalSeen,denied:l,failed:g,label:n??e}}indexPlainText(t,e,n=20,r){if(!t||t.trim().length===0)return this.#r([],e,"",void 0,void 0,r);let o=this.#G(t,n);return A(()=>this.#r(o.map(i=>({...i,hasCode:!1})),e,t,void 0,void 0,r))}indexJSON(t,e,n=lt,r){if(!t||t.trim().length===0)return this.indexPlainText("",e,void 0,r);let o;try{o=JSON.parse(t)}catch{return this.indexPlainText(t,e,void 0,r)}let i=[];return this.#j(o,[],i,n),i.length===0?this.indexPlainText(t,e,void 0,r):A(()=>this.#r(i,e,t,void 0,void 0,r))}#r(t,e,n,r,o,i){let a=t.filter(h=>h.hasCode).length,u=i?.sessionId??"",c=i?.eventId??"",g=this.#t.transaction(()=>{if(this.#d.run(e),this.#h.run(e),this.#g.run(e),t.length===0){let d=this.#o.run(e,r??null,o??null);return Number(d.lastInsertRowid)}let h=this.#a.run(e,t.length,a,r??null,o??null),E=Number(h.lastInsertRowid),m=new Date().toISOString();for(let d of t){let p=d.hasCode?"code":"prose";this.#c.run(d.title,d.content,E,p,null,u,c,m),this.#u.run(d.title,d.content,E,p,null,u,c,m)}return E})();return n&&this.#Y(n),this.#M++,this.#M%s.OPTIMIZE_EVERY===0&&this.#B(),{sourceId:g,label:e,totalChunks:t.length,codeChunks:a}}#P(t){return t.map(e=>({title:e.title,content:e.content,source:e.label,rank:e.rank,contentType:e.content_type,highlighted:e.highlighted,timestamp:e.timestamp??void 0,sessionId:e.session_id??""}))}#s(t,e){return e==="exact"?t:`%${t.replace(/\\/g,"\\\\").replace(/%/g,"\\%").replace(/_/g,"\\_")}%`}search(t,e=3,n,r="AND",o,i="like"){let a=ne(t,r),u,c;return n&&o?(u=i==="exact"?this.#R:this.#T,c=[a,this.#s(n,i),o,e]):n?(u=i==="exact"?this.#f:this.#m,c=[a,this.#s(n,i),e]):o?(u=this.#b,c=[a,o,e]):(u=this.#p,c=[a,e]),A(()=>this.#P(u.all(...c)))}searchTrigram(t,e=3,n,r="AND",o,i="like"){let a=re(t,r);if(!a)return[];let u,c;return n&&o?(u=i==="exact"?this.#D:this.#k,c=[a,this.#s(n,i),o,e]):n?(u=i==="exact"?this.#S:this.#_,c=[a,this.#s(n,i),e]):o?(u=this.#x,c=[a,o,e]):(u=this.#E,c=[a,e]),A(()=>this.#P(u.all(...c)))}fuzzyCorrect(t){let e=t.toLowerCase().trim();if(e.length<3)return null;if(this.#e.has(e)){let c=this.#e.get(e)??null;return this.#e.delete(e),this.#e.set(e,c),c}let n=ie(e.length),r=this.#y.all(e.length-n,e.length+n),o=null,i=n+1,a=!1;for(let{word:c}of r){if(c===e){a=!0;break}let l=se(e,c);l<i&&(i=l,o=c)}let u=a?null:i<=n?o:null;if(this.#e.size>=s.FUZZY_CACHE_SIZE){let c=this.#e.keys().next().value;c!==void 0&&this.#e.delete(c)}return this.#e.set(e,u),u}#U(t,e,n,r,o="like"){let a=Math.max(e*2,10),u=this.search(t,a,n,"OR",r,o),c=this.searchTrigram(t,a,n,"OR",r,o),l=new Map,g=h=>`${h.source}::${h.title}`;for(let[h,E]of u.entries()){let m=g(E),d=l.get(m);d?d.score+=1/(60+h+1):l.set(m,{result:E,score:1/(60+h+1)})}for(let[h,E]of c.entries()){let m=g(E),d=l.get(m);d?d.score+=1/(60+h+1):l.set(m,{result:E,score:1/(60+h+1)})}return Array.from(l.values()).sort((h,E)=>E.score-h.score).slice(0,e).map(({result:h,score:E})=>({...h,rank:-E}))}#$(t,e){let n=e.toLowerCase().split(/\s+/).filter(i=>i.length>=2),r=n.filter(i=>!w.has(i)),o=r.length>0?r:n;return t.map(i=>{let a=i.title.toLowerCase(),u=o.filter(E=>a.includes(E)).length,c=i.contentType==="code"?.6:.3,l=u>0?c*(u/o.length):0,g=0,h=0;if(o.length>=2){let E=i.content.toLowerCase(),m=o.map(d=>oe(E,d));if(!m.some(d=>d.length===0)){g=1/(1+ce(m)/Math.max(E.length,1));let p=ae(m,o);h=.5*Math.min(1,p/4)}}return{result:i,boost:l+g+h}}).sort((i,a)=>a.boost-i.boost||i.result.rank-a.result.rank).map(({result:i})=>i)}searchWithFallback(t,e=3,n,r,o="like",i){this.#V();let a=i?Math.max(e*8,40):e,u=this.#X(i),c=this.#U(t,a,n,r,o),l=u?c.filter(u):c;if(l.length>0)return this.#$(l.slice(0,e),t).map(p=>({...p,matchLayer:"rrf"}));let g=t.toLowerCase().trim().split(/\s+/).filter(d=>d.length>=3&&!w.has(d)),h=g.join(" "),m=g.map(d=>this.fuzzyCorrect(d)??d).join(" ");if(m!==h){let d=this.#U(m,a,n,r,o),p=u?d.filter(u):d;if(p.length>0)return this.#$(p.slice(0,e),m).map(S=>({...S,matchLayer:"rrf-fuzzy"}))}return[]}#X(t){return t?e=>{let n=e.sessionId??"";return n===""||t.has(n)}:null}lastRefreshCount=0;#V(){this.lastRefreshCount=0;let t=this.#t.prepare("SELECT label, file_path, content_hash, indexed_at FROM sources WHERE file_path IS NOT NULL").all();for(let e of t)try{if(!Zt(e.file_path)||this.#i&&this.#i(e.file_path))continue;let n=it(e.file_path).mtime,r=new Date(e.indexed_at+"Z");if(n<=r)continue;let o=ot(e.file_path,"r"),i;try{if(!at(o).isFile())continue;i=st(o,"utf-8")}finally{ct(o)}if(ut("sha256").update(i).digest("hex")===e.content_hash)continue;this.index({content:i,path:e.file_path,source:e.label}),this.lastRefreshCount++}catch{}}getSourceMeta(t){let e=this.#A.get(t);return e?{label:e.label,chunkCount:e.chunk_count,codeChunkCount:e.code_chunk_count,indexedAt:e.indexed_at,filePath:e.file_path??null,contentHash:e.content_hash??null}:null}listSources(){return this.#v.all()}getIndexState(){let t=this.#t.prepare("SELECT COALESCE(SUM(chunk_count), 0) AS total_chunks, COUNT(*) AS total_sources, MAX(indexed_at) AS last_indexed_at FROM sources").get();return{totalChunks:t.total_chunks??0,totalSources:t.total_sources??0,lastIndexedAt:t.last_indexed_at??void 0}}getChunksBySource(t){return this.#N.all(t).map(n=>({title:n.title,content:n.content,source:n.label,rank:0,contentType:n.content_type}))}getDistinctiveTerms(t,e=40){let n=this.#C.get(t);if(!n||n.chunk_count<3)return[];let r=n.chunk_count,o=2,i=Math.max(3,Math.ceil(r*.4)),a=new Map;for(let l of this.#L.iterate(t)){let g=new Set(l.content.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(h=>h.length>=3&&!w.has(h)));for(let h of g)a.set(h,(a.get(h)??0)+1)}return Array.from(a.entries()).filter(([,l])=>l>=o&&l<=i).map(([l,g])=>{let h=Math.log(r/g),E=Math.min(l.length/20,.5),m=/[_]/.test(l),d=l.length>=12,p=m?1.5:d?.8:0;return{word:l,score:h+E+p}}).sort((l,g)=>g.score-l.score).slice(0,e).map(l=>l.word)}getStats(){let t=this.#O.get();return{sources:t?.sources??0,chunks:t?.chunks??0,codeChunks:t?.codeChunks??0}}cleanupStaleSources(t){return this.#t.transaction(r=>(this.#w.run(r),this.#I.run(r),this.#F.run(r)))(t).changes}getDBSizeBytes(){try{return it(this.#n).size}catch{return 0}}#B(){try{this.#t.exec("INSERT INTO chunks(chunks) VALUES('optimize')"),this.#t.exec("INSERT INTO chunks_trigram(chunks_trigram) VALUES('optimize')")}catch{}}close(){this.#B(),W(this.#t)}#Y(t){let e=t.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(o=>o.length>=3&&!w.has(o)),n=[...new Set(e)],r=0;this.#t.transaction(()=>{for(let o of n){let i=this.#l.run(o);r+=i.changes}})(),r>0&&this.#e.clear()}#q(t,e=lt){let n=[],r=t.split(`
`),o=[],i=[],a="",u=()=>{let l=i.join(`
`).trim();if(l.length===0)return;let g=this.#Q(o,a),h=i.some(f=>/^`{3,}/.test(f));if(Buffer.byteLength(l)<=e){n.push({title:g,content:l,hasCode:h}),i=[];return}let E=l.split(/\n\n+/),m=[],d=1,p=()=>{if(m.length===0)return;let f=m.join(`

`).trim();if(f.length===0)return;let S=E.length>1?`${g} (${d})`:g;d++,n.push({title:S,content:f,hasCode:f.includes("```")}),m=[]};for(let f of E){m.push(f);let S=m.join(`

`);Buffer.byteLength(S)>e&&m.length>1&&(m.pop(),p(),m=[f])}p(),i=[]},c=0;for(;c<r.length;){let l=r[c];if(/^[-_*]{3,}\s*$/.test(l)){u(),c++;continue}let g=l.match(/^(#{1,4})\s+(.+)$/);if(g){u();let E=g[1].length,m=g[2].trim();for(;o.length>0&&o[o.length-1].level>=E;)o.pop();o.push({level:E,text:m}),a=m,i.push(l),c++;continue}let h=l.match(/^(`{3,})(.*)?$/);if(h){let E=h[1],m=[l];for(c++;c<r.length;){if(m.push(r[c]),r[c].startsWith(E)&&r[c].trim()===E){c++;break}c++}i.push(...m);continue}i.push(l),c++}return u(),n}#G(t,e){let n=t.split(/\n\s*\n/);if(n.length>=3&&n.length<=200&&n.every(u=>Buffer.byteLength(u)<5e3))return n.map((u,c)=>{let l=u.trim();return{title:l.split(`
`)[0].slice(0,80)||`Section ${c+1}`,content:l}}).filter(u=>u.content.length>0);let r=t.split(`
`);if(r.length<=e)return[{title:"Output",content:t}];let o=[],a=Math.max(e-2,1);for(let u=0;u<r.length;u+=a){let c=r.slice(u,u+e);if(c.length===0)break;let l=u+1,g=Math.min(u+c.length,r.length),h=c[0]?.trim().slice(0,80);o.push({title:h||`Lines ${l}-${g}`,content:c.join(`
`)})}return o}#j(t,e,n,r){let o=e.length>0?e.join(" > "):"(root)",i=JSON.stringify(t,null,2);if(Buffer.byteLength(i)<=r&&!(typeof t=="object"&&t!==null&&!Array.isArray(t)&&Object.values(t).some(u=>typeof u=="object"&&u!==null))){n.push({title:o,content:i,hasCode:!0});return}if(typeof t=="object"&&t!==null&&!Array.isArray(t)){let a=Object.entries(t);if(a.length>0){for(let[u,c]of a)this.#j(c,[...e,u],n,r);return}n.push({title:o,content:i,hasCode:!0});return}if(Array.isArray(t)){this.#J(t,e,n,r);return}n.push({title:o,content:i,hasCode:!1})}#z(t){if(t.length===0)return null;let e=t[0];if(typeof e!="object"||e===null||Array.isArray(e))return null;let n=["id","name","title","path","slug","key","label"],r=e;for(let o of n)if(o in r&&(typeof r[o]=="string"||typeof r[o]=="number"))return o;return null}#K(t,e,n,r,o){let i=t?`${t} > `:"";if(!o)return e===n?`${i}[${e}]`:`${i}[${e}-${n}]`;let a=u=>String(u[o]);return r.length===1?`${i}${a(r[0])}`:r.length<=3?i+r.map(a).join(", "):`${i}${a(r[0])}\u2026${a(r[r.length-1])}`}#J(t,e,n,r){let o=e.length>0?e.join(" > "):"(root)",i=this.#z(t),a=[],u=0,c=l=>{if(a.length===0)return;let g=this.#K(o,u,l,a,i);n.push({title:g,content:JSON.stringify(a,null,2),hasCode:!0})};for(let l=0;l<t.length;l++){a.push(t[l]);let g=JSON.stringify(a,null,2);Buffer.byteLength(g)>r&&a.length>1&&(a.pop(),c(l-1),a=[t[l]],u=l)}c(u+a.length-1)}#Q(t,e){return t.length===0?e||"Untitled":t.map(n=>n.text).join(" > ")}};import{createHash as mt}from"node:crypto";import{accessSync as ln,constants as dn,existsSync as ht,mkdirSync as hn,realpathSync as gn,renameSync as gt}from"node:fs";import{dirname as mn,isAbsolute as fn,join as pt,resolve as En}from"node:path";function ft(s){let t=s.replace(/\\/g,"/");return/^\/+$/.test(t)?"/":/^[A-Za-z]:\/+$/.test(t)?`${t.slice(0,2)}/`:t.replace(/\/+$/,"")}function ue(s){return mt("sha256").update(ft(s)).digest("hex").slice(0,16)}function le(s){let t=ft(s),e=process.platform==="darwin"||process.platform==="win32"?t.toLowerCase():t;return mt("sha256").update(e).digest("hex").slice(0,16)}function Et(s){let{projectDir:t,contentDir:e}=s,n=le(t),r=pt(e,`${n}.db`);if(ht(r))return r;let o=ue(t);if(o===n)return r;let i=pt(e,`${o}.db`);if(ht(i))try{gt(i,r);for(let a of["-wal","-shm"])try{gt(i+a,r+a)}catch{}}catch{}return r}function bt(s){let t=M(s);for(;;){let e=X(t,".claude","context-mode.json");try{let r=_t(e,"utf-8");return{config:JSON.parse(r),configPath:e}}catch{}let n=pe(t);if(n===t)break;t=n}return null}function fe(s,t){let e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`).test(s)}function V(s,t,e){let n=[];try{let r=de(s);for(let o of r){let i=X(s,o);try{let a=St(i);a.isDirectory()&&e?n.push(...V(i,t,!0)):a.isFile()&&fe(o,t)&&n.push(i)}catch{}}}catch{}return n}function F(s,t){try{let e=_t(s,"utf-8");return e.trim().length===0?null:{name:t?me(t,s):yt(s),path:s,content:e}}catch{return null}}function Ee(s){if(s.paths){let t=s.path||".";return s.paths.map(e=>M(t,e)).map(e=>F(e,t)).filter(e=>e!==null)}if(s.exec){let t=s.path||process.cwd();try{let e=ge(s.exec,{cwd:t,encoding:"utf-8",timeout:1e4}).trim(),n=JSON.parse(e);return Array.isArray(n)?n.map(r=>M(t,r)).map(r=>F(r,t)).filter(r=>r!==null):(process.stderr.write(`[context-wrapper] exec for "${s.label}" did not return an array
`),[])}catch(e){return process.stderr.write(`[context-wrapper] exec for "${s.label}" failed: ${e.message}
`),[]}}return s.glob&&s.path?V(s.path,s.glob,!!s.recursive).map(t=>F(t,s.path)).filter(t=>t!==null):(process.stderr.write(`[context-wrapper] source "${s.label}" has no file selection strategy (need glob+path, exec, or paths)
`),[])}function _e(s){if(!s.startsWith("---"))return s;let t=s.indexOf(`
---`,3);return t===-1?s:s.slice(t+4).replace(/^\n+/,"")}function Se(s,t){let e=t.match(/^(\d{4}-\d{2}-\d{2})\.md$/);if(!e)return s;let n=e[1],r=s.split(`
`),o=[];for(let i of r){if(/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(i))continue;let a=i.match(/^(##\s+)(.+)$/);a?o.push(`${a[1]}[${n}] ${a[2]}`):o.push(i)}return o.join(`
`)}function ye(s){return s.replace(/\n{3,}/g,`

`)}function Tt(s,t,e){let n=s;return e?.stripFrontmatter&&(n=_e(n)),e?.prefixDates&&(n=Se(n,t)),ye(n)}function be(s,t){return Tt(s.content,s.name,{stripFrontmatter:t.stripFrontmatter,prefixDates:t.prefixDates})}function Te(s,t){let e=X(s,"content");return he(e,{recursive:!0}),Et({projectDir:M(t),contentDir:e})}function Rt(s){let t=M(s.path),e=St(t),n=String(s.source??yt(t));if(e.isDirectory()){let o=s.glob??"*.md",i=s.recursive!==!1,a=V(t,o,i).map(u=>F(u,t)).filter(u=>u!==null);return{basePath:t,isDirectory:!0,files:a,sourcePrefix:n}}let r=F(t);return{basePath:t,isDirectory:!1,files:r?[r]:[],sourcePrefix:n}}function xt(s,t){let e=t?.stripFrontmatter!==!1,n=t?.prefixDates===!0;return s.map(r=>({file:r,content:Tt(r.content,r.name,{stripFrontmatter:e,prefixDates:n})})).filter(r=>r.content.trim().length>0).map(r=>({...r,source:r.file.name}))}function kt(s,t,e){let n=Te(t,e),r=new P(n),o=0,i=0;for(let a of s.sources){let u=Ee(a);if(u.length!==0)for(let c of u){let l=be(c,a);if(l.trim().length===0)continue;let g=`${a.label}: ${c.name}`,h=r.index({content:l,source:g});o++,i+=h.totalChunks}}return r.close(),{totalSources:o,totalChunks:i,dbPath:n}}function Re(s){return s.replace(/^⚠️ context-mode v[^\n]+ outdated → v[^\n]+ available\. Upgrade: [^\n]+\n\n/,"")}function Dt(s){let t=s?.content;if(Array.isArray(t))for(let e of t)e?.type==="text"&&typeof e.text=="string"&&(e.text=Re(e.text))}function vt(s,t){let e=s?.content;if(Array.isArray(e))for(let n of e){if(n?.type!=="text"||typeof n.text!="string")continue;let r=/\n\n⚠ search call #\d+\/\d+ in this window\..+$/s,o=/^BLOCKED: \d+ search calls in \d+s\..+$/s;r.test(n.text)?n.text=t===!1?n.text.replace(r,""):n.text.replace(r,`

${t}`):o.test(n.text)&&(n.text=t===!1?"":String(t))}}var Ot={execute:"ctx_execute",index:"ctx_index",search:"ctx_search",fetch_and_index:"ctx_fetch_and_index",batch_execute:"ctx_batch_execute"},Lt=new Map(Object.entries(Ot).map(([s,t])=>[t,s])),Me=new Set(["ctx_stats","ctx_doctor","ctx_upgrade","ctx_purge","ctx_insight"]),U={execute:"Run code in the upstream sandbox. Use for derivation over files, command output, or fetched data without dumping raw bytes into context. When `path` is provided, the file is exposed inside the sandbox as FILE_CONTENT.",search:"Search indexed content with BM25/FTS5 ranking. Use after prewarm, index, fetch_and_index, batch_execute, or batch_read. Scope with `source` when you want results from a specific label or batch.",fetch_and_index:"Fetch one or more URLs, convert/index the content, and make it searchable. Use when the source is remote and you want retrieval via `search` instead of pasting raw page content into context.",batch_execute:"Run multiple shell commands, index their outputs, and optionally query the results in the same call. Use for multi-step collection where raw command output should converge into searchable indexed content."},Pe=new Set(["apps","packages","src","lib"]);function Ue(s){let t=s.split("/").filter(Boolean),e=-1;for(let r=t.length-1;r>=0;r--)if(Pe.has(t[r])){e=r;break}let n=e>=0?t.slice(e+1):t.slice(-2);return n=n.filter(r=>r!=="src"),n.join("/")}function $e(s){let t=new Map;return s.map(e=>{let n=(t.get(e)??0)+1;return t.set(e,n),n>1?`${e} (${n})`:e})}function Be(s){let e=(s?.content?.[0]?.text??"").match(/^Indexed (\d+) sections/);return e?parseInt(e[1],10):0}async function je(){let s=process.cwd(),t=bt(s),e=ke(Nt(xe(),"context-mode-")),n=Ct(Ce(import.meta.url)),r=n.endsWith("/src")?Ct(n):n,o=Nt(r,"node_modules","context-mode","server.bundle.mjs"),i=new we({command:"node",args:[o],cwd:s,env:{...process.env,CONTEXT_MODE_DIR:e,CONTEXT_MODE_PROJECT_DIR:s,CLAUDE_PROJECT_DIR:s,PWD:s},stderr:"inherit"}),a=new Ae({name:"context-wrapper",version:"0.2.0"});await a.connect(i);let u=i.pid;if(!u)throw new Error("Failed to get upstream server PID");if(process.stderr.write(`[context-wrapper] Connected to upstream server (pid ${u})
`),t){let d=performance.now(),p=kt(t.config,e,s),f=(performance.now()-d).toFixed(0);process.stderr.write(`[context-wrapper] Pre-warmed ${p.totalChunks} chunks from ${p.totalSources} files in ${f}ms (${p.dbPath})
`)}let{tools:c}=await a.listTools(),l=c.find(d=>d.name==="ctx_execute_file"),g=c.filter(d=>!Me.has(d.name)).filter(d=>d.name!=="ctx_execute_file").filter(d=>Lt.has(d.name)).map(d=>{let p=Lt.get(d.name);if(p==="execute"&&l){let f={...d.inputSchema.properties??{}};return l.inputSchema.properties?.path?f.path=l.inputSchema.properties.path:f.path={type:"string",description:"Absolute file path or relative to project root. When provided, reads this file into a FILE_CONTENT variable inside the sandbox \u2014 file contents stay in sandbox, only your printed output enters context."},{...d,name:p,description:U.execute,inputSchema:{...d.inputSchema,properties:f}}}return p==="index"?{...d,name:p,description:"Store content in the searchable BM25 knowledge base. When `content` is provided, it is indexed directly. When `path` is provided, the wrapper reads files relative to the agent cwd, applies markdown preprocessing, and indexes each file as its own source.",inputSchema:{type:"object",properties:{content:{type:"string",description:"Raw text/markdown to index. Provide this OR path, not both."},path:{type:"string",description:"File or directory path to index. Relative paths resolve from the current working directory/worktree."},source:{type:"string",description:'Source label. For directories, each file gets "{source}: {relative/path}". Defaults to the directory basename or resolved file path.'},glob:{type:"string",description:'Directory-only filename pattern. Defaults to "*.md".'},recursive:{type:"boolean",description:"Directory-only recursive walk flag. Defaults to true."},stripFrontmatter:{type:"boolean",description:"Path-based indexing only. Strip YAML frontmatter before indexing. Defaults to true."},prefixDates:{type:"boolean",description:"Path-based indexing only. For YYYY-MM-DD.md files, prefix ## headings with [date]. Defaults to false."}}}}:p==="search"?{...d,name:p,description:U.search}:p==="fetch_and_index"?{...d,name:p,description:U.fetch_and_index}:p==="batch_execute"?{...d,name:p,description:U.batch_execute}:{...d,name:p}});g.push({name:"batch_read",description:"Read multiple files, index them, and search across their contents. Use instead of batch_execute when all inputs are known file paths (no shell commands needed). Labels are auto-derived from file paths. Returns BM25 search results plus a batch ID \u2014 pass the batch ID as `source` to `search` for follow-up questions scoped to exactly these files.",inputSchema:{type:"object",properties:{files:{type:"array",items:{type:"string"},description:"File paths to read and index. Absolute paths preferred; relative paths resolve from the current working directory.",minItems:1},queries:{type:"array",items:{type:"string"},description:"Search queries to run against the indexed content. Use 5\u20138 comprehensive queries. Each returns top matching sections.",minItems:1}},required:["files","queries"],additionalProperties:!1}});let h=new Le({name:"context-wrapper",version:"0.2.0"},{capabilities:{tools:{}}});h.setRequestHandler(Ie,async()=>({tools:g})),h.setRequestHandler(Fe,async d=>{let{name:p,arguments:f}=d.params;if(p==="index"&&f?.path!==void 0){let v=Y(s,String(f.path)),_;try{_=Rt({path:v,source:typeof f.source=="string"?f.source:void 0,glob:typeof f.glob=="string"?f.glob:void 0,recursive:typeof f.recursive=="boolean"?f.recursive:void 0,stripFrontmatter:typeof f.stripFrontmatter=="boolean"?f.stripFrontmatter:void 0,prefixDates:typeof f.prefixDates=="boolean"?f.prefixDates:void 0})}catch(k){return{content:[{type:"text",text:`Index error: ${k.message}`}],isError:!0}}if(_.files.length===0)return{content:[{type:"text",text:_.isDirectory?`No files matched in ${_.basePath}.`:`Nothing indexable found at ${_.basePath}.`}]};let y=xt(_.files,{stripFrontmatter:typeof f.stripFrontmatter=="boolean"?f.stripFrontmatter:void 0,prefixDates:typeof f.prefixDates=="boolean"?f.prefixDates:void 0}),x=0,N=0,b=[];for(let k of y){let T=_.isDirectory?`${_.sourcePrefix}: ${k.source}`:String(f.source??_.basePath);try{let D=await a.callTool({name:"ctx_index",arguments:{content:k.content,source:T}});N+=Be(D),x++}catch(D){b.push(`${k.file.name}: ${D.message}`)}}let L=_.isDirectory?`Indexed ${x} file${x===1?"":"s"} (${N} chunks) from ${_.basePath}`:`Indexed ${N} sections from: ${String(f.source??_.basePath)}`;return{content:[{type:"text",text:b.length>0?`${L}

Errors (${b.length}):
${b.join(`
`)}`:L}],isError:b.length>0&&x===0}}if(p==="batch_read"){let{files:v,queries:_}=f,y=Ne(3).toString("hex"),x=v.map(R=>Ue(Y(s,R))),N=$e(x),b=[];for(let R=0;R<v.length;R++){let q=Y(s,v[R]),At=`${y}/${N[R]}`,G;try{G=De(q,"utf-8")}catch{b.push(q);continue}await a.callTool({name:"ctx_index",arguments:{content:G,source:At}})}let k=(await a.callTool({name:"ctx_search",arguments:{queries:_,source:y,limit:3}})).content?.[0]?.text??"(no results)",T=b.length>0?`

\u26A0 Could not read ${b.length} file(s):
${b.map(R=>`  - ${R}`).join(`
`)}`:"",D=`

---
**Batch ID:** \`${y}\`
To search only these files: \`search(queries: [...], source: "${y}")\``;return{content:[{type:"text",text:k+T+D}]}}let S;if(p==="execute"&&f?.path!==void 0?S="ctx_execute_file":S=Ot[p],!S)return{content:[{type:"text",text:`Unknown tool: ${p}`}],isError:!0};let C=await a.callTool({name:S,arguments:f});return Dt(C),p==="search"&&t?.config.searchReminder!==void 0&&vt(C,t.config.searchReminder),C});let E=new Oe;await h.connect(E),process.stderr.write(`[context-wrapper] MCP server ready (${g.length} tools) [tmp=${e}]
`);let m=async()=>{await Promise.allSettled([a.close(),h.close()])};process.stdin.on("end",()=>process.exit(0)),process.on("SIGINT",async()=>{await m(),process.exit(0)}),process.on("SIGTERM",async()=>{await m(),process.exit(0)}),process.on("exit",()=>{try{process.kill(u)}catch{}try{ve(e,{recursive:!0,force:!0})}catch{}})}je().catch(s=>{process.stderr.write(`[context-wrapper] Fatal: ${s.message}
${s.stack}
`),process.exit(1)});
